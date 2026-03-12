import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Activity, ThermometerSun, Clock, ChevronRight, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SymptomChecker.module.css';

const quickSymptoms = ['Headache', 'Fatigue', 'Nausea', 'Sore throat', 'Fever', 'Cough', 'Dizziness', 'Back pain', 'Chest tightness'];

export default function SymptomChecker() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('describe');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [description, setDescription] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const toggleSymptom = (s) => {
        setSelectedSymptoms(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );
    };

    const handleAnalyze = async () => {
        if (description.trim() || selectedSymptoms.length > 0) {
            setIsAnalyzing(true);
            // Simulate AI triage engine processing
            await new Promise(r => setTimeout(r, 1500));
            setIsAnalyzing(false);
            setShowResults(true);
        }
    };

    const handleDiscussAI = () => {
        sessionStorage.setItem('pendingScanResult', JSON.stringify({
            analysis: `I see you reported the following symptoms: ${selectedSymptoms.join(', ')}. ${description}. I've run a preliminary triage. Let's discuss when this started feeling worse.`,
            documentType: 'symptom',
            filename: 'Symptom_Triage_Report',
            extractedText: `Reported symptoms: ${selectedSymptoms.join(', ')}. Details: ${description}`
        }));
        navigate('/chat');
    };

    return (
        <div className={styles.symptomPage}>
            <header className={styles.topBar}>
                <h1 className={styles.pageTitle}>Symptom Checker</h1>
            </header>

            {/* Mode Toggle */}
            <div className={styles.modeToggle}>
                <button className={`${styles.modeBtn} ${mode === 'describe' ? styles.modeActive : ''}`} onClick={() => setMode('describe')}>
                    Describe
                </button>
                <button className={`${styles.modeBtn} ${mode === 'bodymap' ? styles.modeActive : ''}`} onClick={() => setMode('bodymap')}>
                    Body Map
                </button>
            </div>

            {mode === 'describe' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.describeSection}>
                    <textarea
                        className={styles.symptomInput}
                        placeholder="Describe your symptoms in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />

                    <div className={styles.quickSection}>
                        <span className={styles.sectionLabel}>QUICK SELECT</span>
                        <div className={styles.chipGrid}>
                            {quickSymptoms.map((s) => (
                                <button
                                    key={s}
                                    className={`${styles.chip} ${selectedSymptoms.includes(s) ? styles.chipActive : ''}`}
                                    onClick={() => toggleSymptom(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration & Severity */}
                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>Duration</span>
                            <select className={styles.metaSelect}>
                                <option>Today</option>
                                <option>2-3 days</option>
                                <option>1 week</option>
                                <option>2+ weeks</option>
                            </select>
                        </div>
                        <div className={styles.metaItem}>
                            <Activity size={14} />
                            <span>Severity</span>
                            <select className={styles.metaSelect}>
                                <option>Mild</option>
                                <option>Moderate</option>
                                <option>Severe</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.bodyMapSection}>
                    <div className={styles.bodyMapPlaceholder}>
                        <Activity size={64} />
                        <span>Tap areas where you feel symptoms</span>
                        <div className={styles.bodyOutline}>
                            {['Head', 'Chest', 'Abdomen', 'Back', 'Arms', 'Legs'].map((area) => (
                                <button
                                    key={area}
                                    className={`${styles.bodyArea} ${selectedSymptoms.includes(area) ? styles.bodyAreaActive : ''}`}
                                    onClick={() => toggleSymptom(area)}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.button
                className={styles.analyzeBtn}
                onClick={handleAnalyze}
                whileTap={{ scale: 0.97 }}
                disabled={(!description.trim() && selectedSymptoms.length === 0) || isAnalyzing}
            >
                {isAnalyzing ? (
                    'Analyzing...'
                ) : (
                    <>
                        <Sparkles size={18} />
                        Analyze Symptoms
                    </>
                )}
            </motion.button>

            {/* Results Modal */}
            <AnimatePresence>
                {showResults && (
                    <>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowResults(false)}
                        />
                        <motion.div
                            className={styles.resultsSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className={styles.sheetHandle} />
                            <button className={styles.closeBtn} onClick={() => setShowResults(false)}>
                                <X size={20} />
                            </button>

                            {/* Triage Banner */}
                            <div className={styles.triageBanner} style={{ borderLeftColor: 'var(--accent-symptom)' }}>
                                <AlertTriangle size={20} style={{ color: 'var(--accent-symptom)' }} />
                                <div>
                                    <span className={styles.triageLevel}>Monitor at Home</span>
                                    <span className={styles.triageDesc}>Your symptoms are likely mild. Monitor for 24-48 hours.</span>
                                </div>
                            </div>

                            {/* Condition Cards */}
                            <div className={styles.conditionList}>
                                {[
                                    { name: 'Tension Headache', prob: 72, severity: 'Low' },
                                    { name: 'Viral Upper Respiratory Infection', prob: 58, severity: 'Low' },
                                    { name: 'Migraine', prob: 34, severity: 'Moderate' },
                                ].map((c, i) => (
                                    <div key={i} className={styles.conditionCard}>
                                        <div className={styles.conditionHeader}>
                                            <span className={styles.conditionName}>{c.name}</span>
                                            <span className={styles.conditionProb}>{c.prob}%</span>
                                        </div>
                                        <div className={styles.probBar}>
                                            <motion.div
                                                className={styles.probFill}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${c.prob}%` }}
                                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                            />
                                        </div>
                                        <span className={styles.conditionSeverity}>Severity: {c.severity}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={styles.discussBtn} onClick={handleDiscussAI}>
                                <Sparkles size={16} />
                                Discuss with AI Coach
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
