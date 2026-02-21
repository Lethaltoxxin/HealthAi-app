import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const ComingSoon = ({ title = "Coming Soon", description = "We are working hard to bring this feature to life." }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            trackEvent('subscribe_click', { method: 'email', feature: title });
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            background: '#F8FAFC',
            borderRadius: '24px',
            marginTop: '24px',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                margin: '0 0 12px',
                color: '#0F172A'
            }}>{title}</h3>

            <p style={{
                fontSize: '16px',
                color: '#64748B',
                marginBottom: '24px',
                lineHeight: '1.5'
            }}>{description}</p>

            {!subscribed ? (
                <form onSubmit={handleSubscribe} style={{
                    display: 'flex',
                    gap: '12px',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        position: 'relative',
                        flex: 1
                    }}>
                        <Mail size={20} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94A3B8'
                        }} />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 42px',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                outline: 'none',
                                fontSize: '15px'
                            }}
                            required
                        />
                    </div>
                    <button type="submit" style={{
                        background: '#0F172A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0 20px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        Notify <ArrowRight size={16} />
                    </button>
                </form>
            ) : (
                <div style={{
                    color: '#059669',
                    fontWeight: '600',
                    padding: '12px',
                    background: '#ECFDF5',
                    borderRadius: '12px',
                    display: 'inline-block'
                }}>
                    Thanks! We'll keep you posted.
                </div>
            )}
        </div>
    );
};

export default ComingSoon;
