import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, RefreshCw, ChevronDown, ChevronUp, Clock, Flame, Droplets, Wheat, Apple, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import styles from './NutritionPlan.module.css';

const mealEmojis = { Breakfast: '🌅', Lunch: '☀️', Snack: '🍪', Dinner: '🌙' };
const mealColors = {
    Breakfast: { bg: '#FFF7ED', accent: '#F97316', ring: '#FDBA74' },
    Lunch: { bg: '#ECFDF5', accent: '#10B981', ring: '#6EE7B7' },
    Snack: { bg: '#FEF3C7', accent: '#F59E0B', ring: '#FCD34D' },
    Dinner: { bg: '#EFF6FF', accent: '#3B82F6', ring: '#93C5FD' }
};

export default function NutritionPlan() {
    const navigate = useNavigate();
    const [planData, setPlanData] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [expandedMeal, setExpandedMeal] = useState(null);

    useEffect(() => {
        const storedPlan = localStorage.getItem('generatedPlan');
        if (storedPlan) {
            setPlanData(JSON.parse(storedPlan));
        } else {
            navigate('/nutrition', { replace: true });
        }
    }, [navigate]);

    if (!planData) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p>Loading your plan...</p>
            </div>
        );
    }

    const currentDay = planData.weeklyPlan[selectedDay];
    const target = planData.userStats.targetCalories;
    const actual = currentDay.actualCalories;
    const caloriePercent = Math.min(100, Math.round((actual / target) * 100));
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference * (1 - caloriePercent / 100);

    return (
        <PageTransition>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <button onClick={() => navigate('/nutrition')} className={styles.iconBtn}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className={styles.headerTitle}>My Plan</h1>
                    <button onClick={() => navigate('/nutrition/grocery')} className={styles.iconBtn}>
                        <ShoppingBag size={22} />
                    </button>
                </header>

                {/* Day Selector */}
                <div className={styles.dayStrip}>
                    {planData.weeklyPlan.map((day, idx) => (
                        <motion.button
                            key={idx}
                            className={`${styles.dayCard} ${selectedDay === idx ? styles.activeDay : ''}`}
                            onClick={() => { setSelectedDay(idx); setExpandedMeal(null); }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className={styles.dayName}>{day.day}</span>
                            <span className={styles.dayNum}>{day.date}</span>
                            {selectedDay === idx && <div className={styles.dayDot} />}
                        </motion.button>
                    ))}
                </div>

                {/* Calorie Overview Card */}
                <motion.div
                    className={styles.overviewCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={selectedDay}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.overviewLeft}>
                        <div className={styles.calorieRing}>
                            <svg viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                                <circle
                                    cx="60" cy="60" r="54" fill="none"
                                    stroke={caloriePercent > 100 ? '#EF4444' : '#10B981'}
                                    strokeWidth="8" strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                />
                            </svg>
                            <div className={styles.calorieCenter}>
                                <span className={styles.calorieNum}>{actual}</span>
                                <span className={styles.calorieSub}>kcal</span>
                            </div>
                        </div>
                        <div className={styles.calorieInfo}>
                            <span className={styles.calorieLabel}>Daily Total</span>
                            <span className={styles.calorieTarget}>
                                <Target size={14} /> Goal: {target} kcal
                            </span>
                        </div>
                    </div>

                    <div className={styles.macroGrid}>
                        <MacroTag icon={<Flame size={14} />} label="Protein" value={`${planData.targetMacros.protein}g`} color="#EF4444" bg="#FEE2E2" />
                        <MacroTag icon={<Wheat size={14} />} label="Carbs" value={`${planData.targetMacros.carbs}g`} color="#F59E0B" bg="#FEF3C7" />
                        <MacroTag icon={<Droplets size={14} />} label="Fat" value={`${planData.targetMacros.fat}g`} color="#8B5CF6" bg="#EDE9FE" />
                    </div>
                </motion.div>

                {/* Meals */}
                <div className={styles.mealsSection}>
                    <h2 className={styles.sectionTitle}>
                        <Apple size={18} /> Today's Meals
                    </h2>
                    <div className={styles.mealsList}>
                        {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(type => (
                            <MealCard
                                key={type}
                                type={type}
                                meal={currentDay.meals[type.toLowerCase()]}
                                expanded={expandedMeal === type.toLowerCase()}
                                onToggle={() => setExpandedMeal(
                                    expandedMeal === type.toLowerCase() ? null : type.toLowerCase()
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <motion.button
                        className={styles.regenerateBtn}
                        onClick={() => navigate('/nutrition-generating')}
                        whileTap={{ scale: 0.97 }}
                    >
                        <RefreshCw size={18} /> Regenerate Plan
                    </motion.button>
                </div>
            </div>
        </PageTransition>
    );
}

function MacroTag({ icon, label, value, color, bg }) {
    return (
        <div className={styles.macroTag} style={{ background: bg }}>
            <div className={styles.macroIcon} style={{ color }}>{icon}</div>
            <div className={styles.macroText}>
                <span className={styles.macroVal} style={{ color }}>{value}</span>
                <span className={styles.macroLabel}>{label}</span>
            </div>
        </div>
    );
}

function MealCard({ type, meal, expanded, onToggle }) {
    const colors = mealColors[type];
    return (
        <motion.div
            className={styles.mealCard}
            onClick={onToggle}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ '--meal-accent': colors.accent, '--meal-bg': colors.bg }}
        >
            <motion.div className={styles.mealHeader} layout="position">
                <div className={styles.mealIcon} style={{ background: colors.bg }}>
                    {mealEmojis[type]}
                </div>
                <div className={styles.mealInfo}>
                    <span className={styles.mealType} style={{ color: colors.accent }}>{type}</span>
                    <h3 className={styles.mealTitle}>{meal.title}</h3>
                </div>
                <div className={styles.mealMeta}>
                    <span className={styles.mealCal}>{meal.calories} <small>cal</small></span>
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={18} color="#94A3B8" />
                    </motion.div>
                </div>
            </motion.div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className={styles.expandedContent}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className={styles.tagsRow}>
                            <span className={styles.tag}><Clock size={12} /> {meal.cookTime} min</span>
                            <span className={styles.tag}><Flame size={12} /> {meal.protein}g Protein</span>
                            <span className={styles.tag}>{meal.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                        </div>

                        <h4 className={styles.ingTitle}>Ingredients</h4>
                        <ul className={styles.ingList}>
                            {meal.ingredients.map((ing, i) => (
                                <li key={i}>{ing}</li>
                            ))}
                        </ul>

                        <button className={styles.recipeBtn} style={{ background: colors.accent }}>
                            View Full Recipe
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
