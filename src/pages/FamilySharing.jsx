import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import styles from './FamilySharing.module.css';

export default function FamilySharing() {
    const navigate = useNavigate();

    const handleInvite = (method) => {
        alert(`Invite sent via ${method}`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/settings')}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Family Access</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className={styles.infoCard}>
                <div className={styles.illustration}>👨‍👩‍👧‍👦</div>
                <h2>Share records securely</h2>
                <p>Give your family members access to your health vault during emergencies.</p>
            </div>

            <div className={styles.actions}>
                <button className={styles.whatsappBtn} onClick={() => handleInvite('WhatsApp')}>
                    <MessageCircle size={20} />
                    Invite via WhatsApp
                </button>

                <button className={styles.smsBtn} onClick={() => handleInvite('SMS')}>
                    <Share2 size={20} />
                    Invite via SMS
                </button>
            </div>

            <div className={styles.listSection}>
                <h3>Active Members</h3>
                <p className={styles.empty}>No family members added yet.</p>
            </div>
        </div>
    );
}
