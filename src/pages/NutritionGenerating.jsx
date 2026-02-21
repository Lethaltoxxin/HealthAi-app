import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { generateWeeklyPlan } from '../utils/nutritionEngine';
import styles from './NutritionGenerating.module.css';

export default function NutritionGenerating() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const hasNavigated = useRef(false);

    useEffect(() => {
        const raw = localStorage.getItem('nutritionUserStats');
        if (!raw) {
            navigate('/nutrition', { replace: true });
            return;
        }

        const userStats = JSON.parse(raw);

        // ALWAYS generate locally first — it's instant and guarantees we have a plan
        const localPlan = generateWeeklyPlan(userStats);
        localStorage.setItem('generatedPlan', JSON.stringify(localPlan));

        // Optionally try backend in background (non-blocking)
        fetch('http://localhost:8000/api/diet/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                age: parseInt(userStats.age) || 30,
                sex: userStats.sex || 'male',
                height_cm: parseInt(userStats.height) || 170,
                weight_kg: parseInt(userStats.weight) || 70,
                activity: userStats.activity || 'moderate',
                goal: userStats.goal || 'maintain',
                diet: userStats.diet || 'vegetarian',
                region: 'north'
            })
        })
            .then(res => res.json())
            .then(plan => {
                // Only override if we haven't navigated yet and plan looks valid
                if (plan && plan.weeklyPlan && !hasNavigated.current) {
                    localStorage.setItem('generatedPlan', JSON.stringify(plan));
                }
            })
            .catch(() => {
                // Already have local plan, nothing to do
            });
    }, [navigate]);

    // Progress animation → navigate when done
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return p + 1;
            });
        }, 25);

        return () => clearInterval(interval);
    }, []);

    // Navigate when progress is complete
    useEffect(() => {
        if (progress === 100 && !hasNavigated.current) {
            hasNavigated.current = true;
            const timer = setTimeout(() => {
                navigate('/nutrition/plan', { replace: true });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [progress, navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Plan is on the Way!</h1>
            <p className={styles.subtitle}>Analyzing your stats and matching recipes...</p>

            <div className={styles.ringContainer}>
                <div className={styles.ring}>
                    <svg viewBox="0 0 100 100" className={styles.svgRing}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none" stroke="#00A8A8" strokeWidth="8"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progress / 100)}
                            strokeLinecap="round"
                            className={styles.progressCircle}
                        />
                    </svg>
                    <div className={styles.percentage}>{progress}%</div>
                </div>
            </div>

            <div className={styles.steps}>
                <Step label="Calculating BMR & TDEE" done={progress > 20} />
                <Step label="Adjusting for Activity Level" done={progress > 50} />
                <Step label="Balancing Macros (Protein/Carb/Fat)" done={progress > 75} />
                <Step label="Selecting Indian Recipes" done={progress > 95} />
            </div>
        </div>
    );
}

function Step({ label, done }) {
    return (
        <div className={`${styles.step} ${done ? styles.stepDone : ''}`}>
            <div className={`${styles.checkbox} ${done ? styles.checked : ''}`}>
                {done && <Check size={14} color="white" />}
            </div>
            <span className={done ? styles.textDone : ''}>{label}</span>
        </div>
    );
}
