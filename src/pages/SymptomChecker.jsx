import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, AlertTriangle, ShieldCheck, Stethoscope, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { symptomCheck, logEvent } from '../api';
import styles from './SymptomChecker.module.css';

export default function SymptomChecker() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello. I'm your AI health assistant. Please describe your symptoms in detail." }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            // Call API
            const response = await symptomCheck({ text: userMsg.text });
            setResult(response);

            logEvent('symptom_check', {
                input: userMsg.text,
                triage: response.triage,
                confidence: response.confidence
            });

            const botMsg = {
                role: 'assistant',
                text: response.explain,
                isResult: true,
                data: response
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I encountered an error analyzing your symptoms. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Symptom Checker</h1>
            </header>

            <div className={styles.chatArea}>
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}
                        >
                            <div className={styles.bubble}>
                                {msg.text}
                            </div>

                            {msg.isResult && (
                                <ResultCard data={msg.data} />
                            )}
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div className={styles.loadingBubble}>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your symptoms..."
                    className={styles.input}
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading || !inputText.trim()} className={styles.sendBtn}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}

function ResultCard({ data }) {
    const isEmergency = data.triage === 'emergency';
    const isConsult = data.triage === 'consult';

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${styles.resultCard} ${isEmergency ? styles.emergency : isConsult ? styles.consult : styles.safe}`}
        >
            <div className={styles.cardHeader}>
                {isEmergency && <AlertTriangle size={24} />}
                {isConsult && <Stethoscope size={24} />}
                {!isEmergency && !isConsult && <ShieldCheck size={24} />}
                <h3>{data.triage.toUpperCase().replace('_', ' ')}</h3>
            </div>

            <div className={styles.reasons}>
                <h4>Potential Causes:</h4>
                <ul>
                    {data.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            </div>

            <div className={styles.actions}>
                <h4>Recommended Action:</h4>
                <ul>
                    {data.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            </div>

            {isEmergency && (
                <button className={styles.callBtn}>
                    <Phone size={18} /> Call Emergency Services
                </button>
            )}

            <div className={styles.confidence}>
                Confidence: {Math.round(data.confidence * 100)}%
            </div>
        </motion.div>
    );
}
