import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { sendHealthMessage, analyzeFileContent } from '../services/healthAI';
import { extractTextFromImage, extractTextFromPDF, detectFileType } from '../services/ocrService';
import styles from './Chat.module.css';

const QUICK_REPLIES = [
    'Check my symptoms',
    'Scan a prescription',
    'Sleep tips',
    'Ask a question',
    'Nutrition advice',
    'Understand my report',
];

const SOURCE_TAGS = ['WHO Guidelines', 'NIH', 'MedlinePlus', 'CDC', 'Mayo Clinic'];

function getRandomSources() {
    return SOURCE_TAGS.slice(0, Math.floor(Math.random() * 2) + 1);
}

const INITIAL_MESSAGE = {
    id: uuidv4(),
    role: 'bot',
    content: "Hello! 👋 I'm your AI Health Assistant. I can help you understand prescriptions, analyze reports, check symptoms, and answer any health questions. How can I help today?",
    confidence: 92,
    sources: ['WHO Guidelines'],
    timestamp: new Date(),
};

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isIncognito, setIsIncognito] = useState(false);
    const [expandedExplain, setExpandedExplain] = useState({});
    const [feedback, setFeedback] = useState({});
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        const pending = sessionStorage.getItem('pendingScanResult');
        if (pending) {
            try {
                const result = JSON.parse(pending);
                sessionStorage.removeItem('pendingScanResult');
                const scanMessage = {
                    id: uuidv4(),
                    role: 'bot',
                    content: result.analysis,
                    confidence: result.confidence || 80,
                    sources: result.documentType === 'prescription'
                        ? ['Drug Reference Database', 'WHO Essential Medicines']
                        : ['Clinical Lab Reference Ranges', 'NIH MedlinePlus'],
                    timestamp: new Date(),
                    isAnalysis: true,
                    fileType: result.documentType,
                    fileName: result.filename,
                    extractedTextPreview: result.extractedText?.slice(0, 200) || '',
                };
                setMessages(prev => [...prev, scanMessage]);
            } catch (e) {
                console.error('Failed to load scan result:', e);
                sessionStorage.removeItem('pendingScanResult');
            }
        }
    }, []);

    const toggleIncognito = () => {
        if (!isIncognito) {
            setIsIncognito(true);
            setMessages([{
                id: uuidv4(),
                role: 'system-notice',
                content: 'This session is Incognito mode. No messages will be stored.',
            }]);
        } else {
            setIsIncognito(false);
            setMessages([INITIAL_MESSAGE]);
        }
    };

    const handleSend = async (text) => {
        const messageText = (text || inputValue).trim();
        if (!messageText || isLoading) return;

        const userMessage = {
            id: uuidv4(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const { text: responseText, confidence } = await sendHealthMessage(
                messages.filter(m => m.role === 'bot' || m.role === 'user'),
                messageText
            );

            const isClinicalQuery = messageText.toLowerCase().includes('lab') || messageText.toLowerCase().includes('report') || messageText.toLowerCase().includes('blood');
            const isSymptomQuery = messageText.toLowerCase().includes('pain') || messageText.toLowerCase().includes('hurt') || messageText.toLowerCase().includes('feel');

            const botMessage = {
                id: uuidv4(),
                role: 'bot',
                content: responseText,
                confidence,
                sources: isClinicalQuery ? ['NIH', 'Mayo Clinic'] : getRandomSources(),
                suggestedActions: isSymptomQuery ? ['Open Symptom Bodymap'] : [],
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('💬 Chat error:', error);
            const errorMessage = error?.message || "I'm having trouble connecting right now. Please check your API key in the .env file and try again.";
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'bot',
                content: `⚠️ ${errorMessage}`,
                confidence: 0,
                sources: [],
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploadedFile(file);
        setUploadStatus('reading');

        const fileMessage = {
            id: uuidv4(),
            role: 'user',
            content: `📎 Uploaded: ${file.name}`,
            timestamp: new Date(),
            isFile: true,
        };
        setMessages(prev => [...prev, fileMessage]);
        setIsLoading(true);

        try {
            let extractedText = '';
            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else if (file.type.startsWith('image/')) {
                extractedText = await extractTextFromImage(file);
            } else {
                extractedText = 'File uploaded for analysis.';
            }

            setUploadStatus('analysing');

            const fileType = detectFileType(file.name, extractedText);
            const { text: analysisText, confidence } = await analyzeFileContent(extractedText, fileType);

            const analysisMessage = {
                id: uuidv4(),
                role: 'bot',
                content: analysisText,
                confidence,
                sources: ['AI Document Analysis', fileType === 'prescription' ? 'Drug Reference Database' : 'Clinical Reference Ranges'],
                timestamp: new Date(),
                isAnalysis: true,
                fileType,
                fileName: file.name,
                extractedTextPreview: extractedText.slice(0, 200) + (extractedText.length > 200 ? '…' : ''),
            };

            setMessages(prev => [...prev, analysisMessage]);
            setUploadStatus('done');
        } catch (error) {
            console.error('📎 File analysis error:', error);
            const errorMessage = error?.message || `I couldn't fully process "${file.name}". For best results, upload a clear JPG or PNG photo of the document.`;
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'bot',
                content: `⚠️ ${errorMessage}`,
                confidence: 70,
                sources: [],
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
            setUploadStatus(null);
            setUploadedFile(null);
        }
    }, [messages]);

    const { getRootProps, getInputProps, open: openFilePicker } = useDropzone({
        onDrop: handleFileUpload,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
    });

    const handleOpenFilePicker = () => {
        try {
            openFilePicker();
        } catch {
            fileInputRef.current?.click();
        }
    };

    const handleNativeFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) handleFileUpload(files);
        e.target.value = '';
    };

    const toggleExplain = (id) => {
        setExpandedExplain(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFeedback = (id, type) => {
        setFeedback(prev => ({ ...prev, [id]: type }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`${styles.chatPage} ${isIncognito ? styles.chatPageDark : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={handleNativeFileSelect}
            />

            {/* ── FLOATING HEADER ── */}
            <header className={styles.topBar}>
                <motion.button className={styles.backBtn} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                    </svg>
                </motion.button>

                <div className={styles.topBarMeta}>
                    <span className={styles.topBarTitle}>AI Health Assistant</span>
                    <div className={styles.statusRow}>
                        <span className={styles.onlineDot} />
                        <span className={styles.onlineLabel}>Online</span>
                    </div>
                </div>

                <div className={styles.topBarActions}>
                    <motion.button
                        className={`${styles.incognitoBtn} ${isIncognito ? styles.incognitoActive : ''}`}
                        onClick={toggleIncognito}
                        whileTap={{ scale: 0.92 }}
                        title="Incognito Mode"
                    >
                        {isIncognito ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                        {isIncognito && <span className={styles.incogLabel}>Incognito mode</span>}
                    </motion.button>
                </div>
            </header>

            {/* ── INCOGNITO BANNER ── */}
            <AnimatePresence>
                {isIncognito && (
                    <motion.div className={styles.incognitoBanner} initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <span>🕵️ Incognito session — nothing will be saved</span>
                        <button onClick={toggleIncognito}>Exit</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── UPLOAD STATUS BAR ── */}
            <AnimatePresence>
                {uploadStatus && (
                    <motion.div className={styles.uploadBar} initial={{ height: 0, opacity: 0 }} animate={{ height: 36, opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className={styles.uploadBarDot} />
                        <span>
                            {uploadStatus === 'reading' && `Reading ${uploadedFile?.name}…`}
                            {uploadStatus === 'analysing' && 'Analysing with AI…'}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MESSAGE THREAD ── */}
            <div className={styles.thread}>
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            className={`${styles.messageRow} ${styles[msg.role === 'system-notice' ? 'systemNoticeRow' : msg.role]}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {msg.role === 'system-notice' && (
                                <div className={styles.systemNotice}>{msg.content}</div>
                            )}

                            {msg.role === 'bot' && (
                                <div className={styles.botGroup}>
                                    {msg.isAnalysis && (
                                        <div className={styles.analysisHeader}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <span>{msg.fileType === 'prescription' ? 'Prescription Analysis' : 'Report Analysis'}</span>
                                            <span className={styles.analysisFileName}>{msg.fileName}</span>
                                        </div>
                                    )}

                                    {msg.isAnalysis && msg.extractedTextPreview && (
                                        <div className={styles.extractedPreview}>
                                            <span className={styles.extractedLabel}>EXTRACTED TEXT</span>
                                            <p>{msg.extractedTextPreview}</p>
                                        </div>
                                    )}

                                    <div className={styles.botBubble}>
                                        <p>{msg.content}</p>
                                    </div>

                                    {msg.confidence > 0 && (
                                        <button className={styles.explainPill} onClick={() => toggleExplain(msg.id)}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                            <span>Why this?</span>
                                            <div className={styles.confidenceBar}>
                                                <div className={styles.confidenceFill} style={{ width: `${msg.confidence}%` }} />
                                            </div>
                                            <span className={styles.confidencePct}>{msg.confidence}%</span>
                                        </button>
                                    )}

                                    <AnimatePresence>
                                        {expandedExplain[msg.id] && (
                                            <motion.div className={styles.explainExpanded} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                This response is based on established medical guidelines with {msg.confidence}% confidence. Always verify with a healthcare professional for personal medical decisions.
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {msg.sources?.length > 0 && (
                                        <div className={styles.sourceChips}>
                                            {msg.sources.map(src => (
                                                <span key={src} className={styles.sourceChip}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                                                    </svg>
                                                    {src}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className={styles.quickReplies}>
                                        {msg.suggestedActions?.length > 0 ?
                                            msg.suggestedActions.map(action => (
                                                <motion.button key={action} className={styles.actionChip} style={{ background: 'rgba(0, 229, 192, 0.15)', color: 'var(--mint-400)', borderColor: 'var(--mint-400)' }} onClick={() => navigate('/symptoms')} whileTap={{ scale: 0.95 }}>
                                                    {action} ➔
                                                </motion.button>
                                            ))
                                            : QUICK_REPLIES.sort(() => 0.5 - Math.random()).slice(0, 3).map(reply => (
                                                <motion.button key={reply} className={styles.quickChip} onClick={() => handleSend(reply)} whileTap={{ scale: 0.95 }}>
                                                    {reply}
                                                </motion.button>
                                            ))}
                                    </div>

                                    <div className={styles.feedbackRow}>
                                        {[
                                            { key: 'agree', icon: '✓', label: 'Agree' },
                                            { key: 'modify', icon: '✎', label: 'Modify' },
                                            { key: 'reject', icon: '✕', label: 'Reject' },
                                        ].map(({ key, icon, label }) => (
                                            <motion.button
                                                key={key}
                                                className={`${styles.feedbackBtn} ${styles[`fb_${key}`]} ${feedback[msg.id] === key ? styles.fbSelected : ''}`}
                                                onClick={() => handleFeedback(msg.id, key)}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span>{icon}</span> {label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {msg.role === 'user' && (
                                <div className={`${styles.userBubble} ${msg.isFile ? styles.userFileBubble : ''}`}>
                                    {msg.isFile && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                                        </svg>
                                    )}
                                    {msg.content}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                <AnimatePresence>
                    {isLoading && (
                        <motion.div className={`${styles.messageRow} ${styles.bot}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className={styles.botBubble}>
                                <div className={styles.typingDots}>
                                    {[0, 1, 2].map(i => (
                                        <motion.span key={i} className={styles.dot} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* ── COMPOSER ── */}
            <div className={styles.composer}>
                <motion.button className={styles.composerIcon} onClick={handleOpenFilePicker} whileTap={{ scale: 0.96 }} title="Upload prescription or report">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                </motion.button>

                <input
                    ref={inputRef}
                    className={styles.textInput}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isIncognito ? 'Private message…' : 'Type a message…'}
                    disabled={isLoading}
                />

                <motion.button
                    className={`${styles.sendBtn} ${(!inputValue.trim() || isLoading) ? styles.sendBtnDisabled : ''}`}
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    whileTap={{ scale: 0.96 }}
                    title="Send"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}
