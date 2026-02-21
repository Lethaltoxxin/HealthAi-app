import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateBMR, calculateTDEE, getTargetCalories } from '../utils/nutritionEngine';
import styles from './NutritionOnboarding.module.css';

export default function NutritionOnboarding() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        goal: 'lose', // lose, maintain, gain
        sex: 'female',
        age: 28,
        height: 165, // cm
        weight: 65, // kg
        activity: 'sedentary', // sedentary, light, moderate, active, very_active
        diet: 'veg', // veg, non-veg, egg, vegan
        cuisine: 'north', // north, south, any
        budget: 5000,
        allergies: []
    });

    const [liveStats, setLiveStats] = useState({ bmr: 0, tdee: 0, target: 0 });

    useEffect(() => {
        // Real-time calculation for preview
        const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.sex);
        const tdee = calculateTDEE(bmr, formData.activity);
        const target = getTargetCalories(tdee, formData.goal);
        setLiveStats({ bmr: Math.round(bmr), tdee, target });
    }, [formData]);

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handleSubmit = () => {
        // Save to local storage for the generating page to pick up
        localStorage.setItem('nutritionUserStats', JSON.stringify(formData));
        navigate('/nutrition-generating');
    };

    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${step * 20}%` }} />
            </div>

            <div className={styles.content}>
                {step === 1 && (
                    <StepGoal value={formData.goal} onChange={(val) => setFormData({ ...formData, goal: val })} />
                )}
                {step === 2 && (
                    <StepStats data={formData} onChange={setFormData} />
                )}
                {step === 3 && (
                    <StepActivity value={formData.activity} onChange={(val) => setFormData({ ...formData, activity: val })} />
                )}
                {step === 4 && (
                    <StepDiet data={formData} onChange={setFormData} />
                )}
                {step === 5 && (
                    <StepReview stats={liveStats} goal={formData.goal} />
                )}
            </div>

            <div className={styles.footer}>
                <button className={styles.backBtn} onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <button className={styles.nextBtn} onClick={handleNext}>
                    {step === 5 ? 'Generating Plan' : 'Next'}
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

function StepGoal({ value, onChange }) {
    const goals = [
        { id: 'lose', label: 'Lose Weight', icon: '📉', desc: 'Sustainble deficit (~15%)' },
        { id: 'gain', label: 'Build Muscle', icon: '💪', desc: 'High protein surplus' },
        { id: 'maintain', label: 'Maintain', icon: '⚖️', desc: 'Balance & Health' },
    ];
    return (
        <div className={styles.stepContainer}>
            <h2>What is your main goal?</h2>
            <div className={styles.optionsGrid}>
                {goals.map(g => (
                    <button
                        key={g.id}
                        className={`${styles.optionCard} ${value === g.id ? styles.selected : ''}`}
                        onClick={() => onChange(g.id)}
                    >
                        <span className={styles.icon}>{g.icon}</span>
                        <div>
                            <span className={styles.optionTitle}>{g.label}</span>
                            <span className={styles.optionDesc}>{g.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function StepStats({ data, onChange }) {
    return (
        <div className={styles.stepContainer}>
            <h2>Let's Talk Numbers</h2>
            <div className={styles.inputGroup}>
                <label>Age</label>
                <input type="number" value={data.age} onChange={e => onChange({ ...data, age: Number(e.target.value) })} />
            </div>
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Height (cm)</label>
                    <input type="number" value={data.height} onChange={e => onChange({ ...data, height: Number(e.target.value) })} />
                </div>
                <div className={styles.inputGroup}>
                    <label>Weight (kg)</label>
                    <input type="number" value={data.weight} onChange={e => onChange({ ...data, weight: Number(e.target.value) })} />
                </div>
            </div>
            <div className={styles.sexToggle}>
                <button className={data.sex === 'female' ? styles.activeSex : ''} onClick={() => onChange({ ...data, sex: 'female' })}>Female</button>
                <button className={data.sex === 'male' ? styles.activeSex : ''} onClick={() => onChange({ ...data, sex: 'male' })}>Male</button>
            </div>
        </div>
    );
}

function StepActivity({ value, onChange }) {
    const levels = [
        { id: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
        { id: 'light', label: 'Lightly Active', desc: '1-3 days/week exercise' },
        { id: 'moderate', label: 'Moderate', desc: '3-5 days/week exercise' },
        { id: 'active', label: 'Active', desc: 'Daily exercise' }
    ];
    return (
        <div className={styles.stepContainer}>
            <h2>How active are you?</h2>
            {levels.map(l => (
                <button
                    key={l.id}
                    className={`${styles.listOption} ${value === l.id ? styles.selectedList : ''}`}
                    onClick={() => onChange(l.id)}
                >
                    <div style={{ fontWeight: 600 }}>{l.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{l.desc}</div>
                </button>
            ))}
        </div>
    );
}

function StepDiet({ data, onChange }) {
    return (
        <div className={styles.stepContainer}>
            <h2>Preferences</h2>
            <label className={styles.fieldLabel}>Diet Type</label>
            <div className={styles.tagGroup}>
                {['veg', 'non-veg', 'egg', 'vegan'].map(d => (
                    <button
                        key={d}
                        className={`${styles.tag} ${data.diet === d ? styles.activeTag : ''}`}
                        onClick={() => onChange({ ...data, diet: d })}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <label className={styles.fieldLabel} style={{ marginTop: 20 }}>Region Preference</label>
            <div className={styles.tagGroup}>
                {['north', 'south', 'any'].map(c => (
                    <button
                        key={c}
                        className={`${styles.tag} ${data.cuisine === c ? styles.activeTag : ''}`}
                        onClick={() => onChange({ ...data, cuisine: c })}
                    >
                        {c} India
                    </button>
                ))}
            </div>
        </div>
    );
}

function StepReview({ stats, goal }) {
    return (
        <div className={styles.stepContainer}>
            <h2>Your Estimate</h2>
            <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                    <span>BMR (Base)</span>
                    <strong>{stats.bmr} kcal</strong>
                </div>
                <div className={styles.reviewRow}>
                    <span>TDEE (Daily Burn)</span>
                    <strong>{stats.tdee} kcal</strong>
                </div>
                <div className={styles.divider} />
                <div className={styles.reviewMain}>
                    <span>Target for {goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Gain' : 'Maintenance'}</span>
                    <h1 className={styles.targetVal}>{stats.target} <span>kcal/day</span></h1>
                </div>
            </div>
            <p className={styles.disclaimer}>
                <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                We calculate this using the Mifflin-St Jeor equation customized for Indian body types.
            </p>
        </div>
    );
}
