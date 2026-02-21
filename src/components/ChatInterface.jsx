import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getChatHistory } from '../services/dbService';
import { serverTimestamp } from 'firebase/firestore';
import styles from './ChatInterface.module.css';

export default function ChatInterface() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([
        { id: 'welcome', role: 'assistant', content: "Hello! I'm your health assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Save to Firestore (fire & forget for demo speed)
        if (currentUser) {
            sendMessage(currentUser.uid, input, 'user');
        }

        // Simulate AI Response
        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I've noted that. Is there anything else you'd like to add or upload regarding your health?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);

            if (currentUser) {
                sendMessage(currentUser.uid, aiResponse.content, 'assistant');
            }
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messageList}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.aiRow}`}
                    >
                        <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className={`${styles.messageRow} ${styles.aiRow}`}>
                        <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typing}`}>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />

                <div className={styles.disclaimer}>
                    This does not replace medical advice.
                </div>
            </div>

            <div className={styles.inputArea}>
                <button className={styles.iconBtn}>
                    <Paperclip size={20} />
                </button>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type or speak..."
                        className={styles.input}
                    />
                    <button className={styles.micBtn}>
                        <Mic size={18} />
                    </button>
                </div>
                <button
                    className={`${styles.sendBtn} ${input.trim() ? styles.active : ''}`}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
