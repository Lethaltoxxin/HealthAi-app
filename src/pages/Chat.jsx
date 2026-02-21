import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Phone, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { sendChat, logEvent } from '../api';
import { MessageBubble } from '../components/chat/MessageBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { QuickReplies } from '../components/chat/QuickReplies';
import styles from './Chat.module.css';

const starterPrompts = [
    "I have a fever and headache",
    "Build me a workout plan",
    "Vegetarian diet ideas",
    "I feel stressed"
];

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your HealthAi assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        logEvent('chat_open', {});
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (text) => {
        if (!text.trim()) return;

        // 1. Add User Message
        const tempId = Date.now();
        const userMsg = { id: tempId, type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // 2. Call API
            const response = await sendChat(text);

            // 3. Add Bot Response
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.message,
                intent: response.intent,
                actions: response.actions,
                data: response.data
            };
            setMessages(prev => [...prev, botMsg]);
            logEvent('chat_bot_response', { intent: response.intent });

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: "I'm having trouble connecting right now. Please try again later."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className={styles.headerInfo}>
                        <h1>Health Assistant</h1>
                        <span className={styles.status}>Online</span>
                    </div>
                </header>

                {/* Messages Area */}
                <div className={styles.chatArea}>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Area */}
                <div className={styles.footer}>
                    {/* Quick Replies (only show if last message was bot) */}
                    {!isTyping && messages[messages.length - 1].type === 'bot' && (
                        <div className={styles.quickWrappper}>
                            <QuickReplies
                                prompts={starterPrompts}
                                onSelect={handleSend}
                            />
                        </div>
                    )}

                    {/* Input */}
                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                            disabled={isTyping}
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || isTyping}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
