import { useState, useMemo, useEffect } from 'react';
import { Play, TrendingUp, Calendar, Info, Search, X, Check, Activity, Target } from 'lucide-react';
import { indianDietDB, nutritionTips } from '../data/indianDietDB';
import styles from './Nutrition.module.css';

export default function Nutrition() {
    // === STATE MANAGEMENT ===
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('healthai_nutrition_profile');
        return saved ? JSON.parse(saved) : null;
    });

    const [isFormOpen, setIsFormOpen] = useState(!profile);
    const [formData, setFormData] = useState(profile || {
        weight: '',
        height: '',
        age: '',
        gender: 'male',
        activity: 'moderate',
        goal: 'maintain',
        dietPref: 'Veg'
    });

    const [targetCals, setTargetCals] = useState(profile?.targetCals || 2000);
    const [selectedMeals, setSelectedMeals] = useState(() => {
        const saved = localStorage.getItem('healthai_nutrition_meals');
        return saved ? JSON.parse(saved) : [];
    });

    // Live Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Save tracking
    useEffect(() => {
        if (profile) localStorage.setItem('healthai_nutrition_profile', JSON.stringify(profile));
        localStorage.setItem('healthai_nutrition_meals', JSON.stringify(selectedMeals));
    }, [profile, selectedMeals]);

    // === TDEE CALCULATION ===
    const calculatePlan = (e) => {
        e.preventDefault();

        let bmr = 10 * parseFloat(formData.weight) + 6.25 * parseFloat(formData.height) - 5 * parseInt(formData.age);
        bmr += formData.gender === 'male' ? 5 : -161;

        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725
        };
        let tdee = bmr * activityMultipliers[formData.activity];

        if (formData.goal === 'lose') tdee -= 500;
        else if (formData.goal === 'gain') tdee += 500;

        const calTarget = Math.round(tdee);
        setTargetCals(calTarget);

        const finalProfile = { ...formData, targetCals: calTarget };
        setProfile(finalProfile);

        // Generate an initial plan if empty
        if (selectedMeals.length === 0) {
            generateMealPlan(finalProfile, calTarget);
        }
        setIsFormOpen(false);
    };

    const generateMealPlan = (prf, cals) => {
        const filteredDB = indianDietDB.filter(item =>
            item.preference === prf.dietPref ||
            (prf.dietPref === 'Non-Veg' && item.preference === 'Veg') // Non-veg can eat veg
        );

        if (filteredDB.length === 0) return; // Fallback if no data

        const getMeal = (cat) => {
            const options = filteredDB.filter(m => m.category === cat);
            return options.length > 0 ? options[Math.floor(Math.random() * options.length)] : null;
        };

        const plan = [
            { ...getMeal('Breakfast'), mealTime: 'Breakfast', logged: false, uid: Date.now() + 1 },
            { ...getMeal('Lunch'), mealTime: 'Lunch', logged: false, uid: Date.now() + 2 },
            { ...getMeal('Snack'), mealTime: 'Snack', logged: false, uid: Date.now() + 3 },
            { ...getMeal('Dinner'), mealTime: 'Dinner', logged: false, uid: Date.now() + 4 }
        ].filter(m => m.name); // Filter out nulls

        setSelectedMeals(plan);
    };

    const regeneratePlan = () => {
        if (profile) generateMealPlan(profile, targetCals);
    };

    const toggleMealLogged = (uid) => {
        setSelectedMeals(prev => prev.map(m => m.uid === uid ? { ...m, logged: !m.logged } : m));
    };

    // Live Search Logic
    const filteredFoods = searchQuery
        ? indianDietDB.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
        : [];

    const addFoodFromSearch = (food) => {
        const newMeal = {
            ...food,
            mealTime: 'Added Item',
            logged: true, // Automatically logged
            uid: Date.now()
        };
        setSelectedMeals(prev => [...prev, newMeal]);
        setSearchQuery('');
    };

    // === MACRO TRACKING (APPLE HEALTH RINGS) ===
    const consumedCals = useMemo(() => selectedMeals.filter(m => m.logged).reduce((sum, m) => sum + m.calories, 0), [selectedMeals]);
    const consumedProtein = useMemo(() => selectedMeals.filter(m => m.logged).reduce((sum, m) => sum + m.protein, 0), [selectedMeals]);
    const consumedCarbs = useMemo(() => selectedMeals.filter(m => m.logged).reduce((sum, m) => sum + m.carbs, 0), [selectedMeals]);
    const consumedFat = useMemo(() => selectedMeals.filter(m => m.logged).reduce((sum, m) => sum + m.fat, 0), [selectedMeals]);

    // Apple Health Standard Macros Goals based on TDEE
    const pTarget = Math.round((targetCals * 0.3) / 4); // 30% calories from protein (1g = 4cal)
    const cTarget = Math.round((targetCals * 0.4) / 4); // 40% from carbs
    const fTarget = Math.round((targetCals * 0.3) / 9); // 30% from fats (1g = 9cal)

    // SVG Ring Calculations
    // 3 rings: Outer=Calories(Red), Mid=Protein(Green), Inner=Carbs(Blue)
    const calPercent = Math.min((consumedCals / targetCals) * 100, 100) || 0;
    const pPercent = Math.min((consumedProtein / pTarget) * 100, 100) || 0;
    const cPercent = Math.min((consumedCarbs / cTarget) * 100, 100) || 0;

    const rOuter = 80;
    const rMid = 60;
    const rInner = 40;

    const dashOuter = 2 * Math.PI * rOuter;
    const dashMid = 2 * Math.PI * rMid;
    const dashInner = 2 * Math.PI * rInner;

    const offOuter = dashOuter - (dashOuter * calPercent) / 100;
    const offMid = dashMid - (dashMid * pPercent) / 100;
    const offInner = dashInner - (dashInner * cPercent) / 100;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Nutrition</h1>
                {profile && (
                    <button onClick={() => setIsFormOpen(true)} className={styles.editProfileBtn}>
                        Update Profile
                    </button>
                )}
            </header>

            {/* ONBOARDING FORM */}
            {isFormOpen && (
                <div className={styles.onboardingCard}>
                    <h2>Let's build your HealthAi Plan</h2>
                    <form onSubmit={calculatePlan} className={styles.formGroup}>
                        <div className={styles.inputRow}>
                            <input type="number" placeholder="Weight (kg)" required value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                            <input type="number" placeholder="Height (cm)" required value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                            <input type="number" placeholder="Age" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select value={formData.activity} onChange={e => setFormData({ ...formData, activity: e.target.value })}>
                            <option value="sedentary">Sedentary (Office Job)</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="active">Very Active</option>
                        </select>
                        <select value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })}>
                            <option value="lose">Weight Loss</option>
                            <option value="maintain">Maintenance</option>
                            <option value="gain">Muscle Gain</option>
                        </select>
                        <select value={formData.dietPref} onChange={e => setFormData({ ...formData, dietPref: e.target.value })}>
                            <option value="Veg">Vegetarian</option>
                            <option value="Non-Veg">Non-Vegetarian</option>
                            <option value="Jain">Jain</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Keto">Keto</option>
                        </select>
                        <button type="submit" className={styles.submitBtn}>Generate Apple Health UI Plan</button>
                    </form>
                </div>
            )}

            {/* MAIN DASHBOARD */}
            {!isFormOpen && profile && (
                <div className={styles.dashboard}>

                    {/* Live Search Bar for Food Tracking */}
                    <div className={styles.searchSection}>
                        <div className={styles.searchContainer}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search & Add Food (e.g., Paneer, Dal)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {searchQuery && (
                            <div className={styles.searchResults}>
                                {filteredFoods.length > 0 ? (
                                    filteredFoods.map(food => (
                                        <div key={food.id} className={styles.searchResultItem}>
                                            <div className={styles.foodMeta}>
                                                <span className={styles.foodName}>{food.name}</span>
                                                <span className={styles.foodStats}>
                                                    {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                                                </span>
                                            </div>
                                            <button className={styles.addFoodBtn} onClick={() => addFoodFromSearch(food)}>
                                                Add
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noResults}>No Indian foods found matching "{searchQuery}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Apple Health 3-Ring Activity Dashboard */}
                    <div className={styles.ringCard}>
                        {/* The overlapping SVG Rings */}
                        <div className={styles.ringWrapper}>
                            <svg viewBox="0 0 200 200" className={styles.progressRing}>
                                {/* Outer Ring: Calories (Red/Pink) */}
                                <circle cx="100" cy="100" r={rOuter} className={`${styles.ringBg} ${styles.bgRed}`} />
                                <circle
                                    cx="100" cy="100" r={rOuter}
                                    className={`${styles.ringProgress} ${styles.progRed}`}
                                    strokeDasharray={`${dashOuter} ${dashOuter}`}
                                    strokeDashoffset={offOuter}
                                />

                                {/* Middle Ring: Protein (Green) */}
                                <circle cx="100" cy="100" r={rMid} className={`${styles.ringBg} ${styles.bgGreen}`} />
                                <circle
                                    cx="100" cy="100" r={rMid}
                                    className={`${styles.ringProgress} ${styles.progGreen}`}
                                    strokeDasharray={`${dashMid} ${dashMid}`}
                                    strokeDashoffset={offMid}
                                />

                                {/* Inner Ring: Carbs (Blue) */}
                                <circle cx="100" cy="100" r={rInner} className={`${styles.ringBg} ${styles.bgBlue}`} />
                                <circle
                                    cx="100" cy="100" r={rInner}
                                    className={`${styles.ringProgress} ${styles.progBlue}`}
                                    strokeDasharray={`${dashInner} ${dashInner}`}
                                    strokeDashoffset={offInner}
                                />
                            </svg>
                        </div>

                        {/* Side Fitness Statistics Panel */}
                        <div className={styles.fitnessStats}>
                            <div className={styles.fStat}>
                                <span className={styles.fStatLabel} style={{ color: '#ff2a55' }}>CALORIES</span>
                                <span className={styles.fStatVal}>{consumedCals}/{targetCals} <span className={styles.fUnit}>kcal</span></span>
                            </div>
                            <div className={styles.fStat}>
                                <span className={styles.fStatLabel} style={{ color: '#00f560' }}>PROTEIN</span>
                                <span className={styles.fStatVal}>{consumedProtein}/{pTarget} <span className={styles.fUnit}>g</span></span>
                            </div>
                            <div className={styles.fStat}>
                                <span className={styles.fStatLabel} style={{ color: '#08f6ff' }}>CARBS</span>
                                <span className={styles.fStatVal}>{consumedCarbs}/{cTarget} <span className={styles.fUnit}>g</span></span>
                            </div>
                            <div className={styles.fStat}>
                                <span className={styles.fStatLabel} style={{ color: '#ff9f0a' }}>FATS</span>
                                <span className={styles.fStatVal}>{consumedFat}/{fTarget} <span className={styles.fUnit}>g</span></span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.planHeader}>
                        <h3>Your {profile.dietPref} Daily Plan</h3>
                        <button onClick={regeneratePlan} className={styles.regenBtn}>
                            <TrendingUp size={16} /> Regenerate
                        </button>
                    </div>

                    <div className={styles.mealList}>
                        {selectedMeals.map((meal) => (
                            <div key={meal.uid} className={`${styles.mealCard} ${meal.logged ? styles.logged : ''}`}>
                                <div className={styles.mealMain}>
                                    <div>
                                        <div className={styles.mealTime}>{meal.mealTime}</div>
                                        <h4 className={styles.mealName}>{meal.name}</h4>
                                        <p className={styles.mealMacros}>
                                            {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                        </p>
                                    </div>
                                    <button
                                        className={`${styles.logBtn} ${meal.logged ? styles.logActive : ''}`}
                                        onClick={() => toggleMealLogged(meal.uid)}
                                    >
                                        <Check size={20} className={styles.checkIcon} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}
