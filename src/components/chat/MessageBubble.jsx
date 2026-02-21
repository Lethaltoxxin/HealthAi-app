import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, Stethoscope, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatComponents.module.css';

export function MessageBubble({ message, isLast }) {
    const isBot = message.type === 'bot';
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`${styles.row} ${isBot ? styles.botRow : styles.userRow}`}
        >
            {isBot && (
                <div className={styles.avatar}>
                    <MessageSquare size={16} color="white" />
                </div>
            )}

            <div className={styles.bubbleWrapper}>
                <div className={`${styles.bubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
                    {message.text}
                </div>

                {/* Rich Actions / Cards */}
                {message.actions && message.actions.length > 0 && (
                    <div className={styles.actionsGrid}>
                        {message.actions.map((action, idx) => (
                            <button
                                key={idx}
                                className={styles.actionBtn}
                                onClick={() => {
                                    if (action.type === 'navigate') navigate(action.value);
                                    if (action.type === 'link') window.location.href = action.value;
                                    if (action.type === 'call') window.location.href = `tel:${action.value}`;
                                }}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Triage Data Embedding */}
                {message.data && message.data.triage && (
                    <TriageCard data={message.data} />
                )}
            </div>
        </motion.div>
    );
}

function TriageCard({ data }) {
    const isEmergency = data.triage === 'emergency';
    const isConsult = data.triage === 'consult';

    return (
        <div className={`${styles.card} ${isEmergency ? styles.emergency : isConsult ? styles.consult : styles.safe}`}>
            <div className={styles.cardHeader}>
                {isEmergency && <AlertTriangle size={18} />}
                {isConsult && <Stethoscope size={18} />}
                {!isEmergency && !isConsult && <Activity size={18} />}
                <span>{data.triage.toUpperCase().replace('_', ' ')}</span>
            </div>
            {data.reasons && data.reasons.length > 0 && (
                <p className={styles.reason}>{data.reasons[0]}</p>
            )}
        </div>
    );
}
