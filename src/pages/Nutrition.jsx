import React, { useState } from 'react';
import { Plus, Flame, ChevronLeft, Menu, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { trackEvent } from '../utils/analytics';
import styles from './Nutrition.module.css';

export default function Nutrition() {
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState('Tue');
    const [generatedPlan, setGeneratedPlan] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const weekDays = [
        { day: 'Wed', date: '4' },
        { day: 'Thu', date: '5' },
        { day: 'Fri', date: '6' },
        { day: 'Sat', date: '7' },
        { day: 'Sun', date: '8' },
        { day: 'Mon', date: '9' },
        { day: 'Tue', date: '10' },
    ];

    const handleGenerate = () => {
        trackEvent('plan_generate_click');
        navigate('/nutrition-onboarding');
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.iconBtn}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1>Nutrition</h1>
                    <button className={styles.iconBtn}><Menu size={24} /></button>
                </header>

                <div className={styles.dateStrip}>
                    {weekDays.map((item, idx) => {
                        const isSelected = item.day === selectedDay;
                        return (
                            <div
                                key={idx}
                                className={`${styles.dateCard} ${isSelected ? styles.activeDate : ''}`}
                                onClick={() => setSelectedDay(item.day)}
                            >
                                <span className={styles.dayLabel}>{item.day}</span>
                                <span className={styles.dateLabel}>{item.date}</span>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.caloriesCard}>
                    <div className={styles.caloriesInfo}>
                        <span className={styles.caloriesValue}>2781</span>
                        <span className={styles.caloriesLabel}>Calories left to eat</span>
                    </div>
                    <div className={styles.caloriesRing}>
                        <div className={styles.ringOuter}>
                            <div className={styles.ringInner}>
                                <Flame size={32} color="#F97316" fill="#F97316" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.macrosGrid}>
                    <MacroCard label="Protein" value="126 g" icon="🫘" color="#EF4444" />
                    <MacroCard label="Carbs" value="396 g" icon="🍞" color="#EAB308" />
                    <MacroCard label="Fat" value="77 g" icon="🥑" color="#F59E0B" />
                </div>

                <div className={styles.mealsContainer}>
                    <MealSection
                        title="Breakfast"
                        target="0 of 695 Cal"
                        placeholder="All you need is some breakfast 🥞"
                        onAdd={() => trackEvent('meal_log', { type: 'breakfast' })}
                    />
                    <MealSection
                        title="Lunch"
                        target="0 of 973 Cal"
                        placeholder="Mid-day meals keep your focus strong 🥗"
                        onAdd={() => trackEvent('meal_log', { type: 'lunch' })}
                    />
                    <MealSection
                        title="Dinner"
                        target="0 of 695 Cal"
                        placeholder="End your day with a balanced meal 🍲"
                        onAdd={() => trackEvent('meal_log', { type: 'dinner' })}
                    />
                </div>

                {/* Plan Generator */}
                <div className={styles.planGenerator}>
                    <div className={styles.generatorHeader}>
                        <h3>Weekly Plan</h3>
                        <span className={styles.badge}>Beta</span>
                    </div>
                    {generatedPlan ? (
                        <div className={styles.planPreview}>
                            <div className={styles.planDay}>
                                <span>Tomorrow</span>
                                <p>Oatmeal & Berries • Grilled Chicken Salad</p>
                            </div>
                            <div className={styles.planDay}>
                                <span>Thursday</span>
                                <p>Avocado Toast • Salmon & Quinoa</p>
                            </div>
                            <button className={styles.viewFullBtn}>View Full 7-Day Plan</button>
                        </div>
                    ) : (
                        <div className={styles.generatorCta}>
                            <p>Get a personalized meal plan based on your macros.</p>
                            <button
                                className={styles.generateBtn}
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generating...' : 'Generate 7-Day Plan'}
                                {!isGenerating && <ArrowRight size={16} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}

function MacroCard({ label, value, icon, color }) {
    return (
        <div className={styles.macroCard}>
            <div className={styles.macroHeader}>
                <span className={styles.macroValue}>{value}</span>
                <span className={styles.macroLabel}>{label} left</span>
            </div>
            <div className={styles.macroRing}>
                <div className={styles.miniRing} style={{ borderColor: `${color}30` }}>
                    <span className={styles.macroIcon}>{icon}</span>
                </div>
            </div>
        </div>
    );
}

function MealSection({ title, target, placeholder, onAdd }) {
    return (
        <div className={styles.mealSection}>
            <div className={styles.mealHeader}>
                <h3>{title}</h3>
                <div className={styles.mealRight}>
                    <span>{target}</span>
                    <button className={styles.addBtn} onClick={onAdd}>
                        <Plus size={16} color="white" />
                    </button>
                </div>
            </div>
            <div className={styles.mealPlaceholder}>
                {placeholder}
            </div>
        </div>
    );
}
