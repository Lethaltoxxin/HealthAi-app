// Nutrition Engine - Logic & Database

// --- RECIPE DATABASE (Indian Context) ---
const recipes = [
    // BREAKFAST
    {
        id: 'bk_1', title: 'Vegetable Poha', region: 'North', type: 'veg', calories: 280, protein: 6, carbs: 45, fat: 8,
        cookTime: 15, tags: ['breakfast', 'light'], ingredients: ['Flattened Rice', 'Peanuts', 'Onion', 'Mustard Seeds']
    },
    {
        id: 'bk_2', title: 'Moong Dal Cheela', region: 'North', type: 'veg', calories: 220, protein: 12, carbs: 28, fat: 6,
        cookTime: 20, tags: ['breakfast', 'high-protein'], ingredients: ['Moong Dal', 'Spinach', 'Ginger', 'Green Chili']
    },
    {
        id: 'bk_3', title: 'Idli Sambar', region: 'South', type: 'veg', calories: 300, protein: 10, carbs: 55, fat: 4,
        cookTime: 30, tags: ['breakfast', 'fermented'], ingredients: ['Rice', 'Urad Dal', 'Mixed Vegetables', 'Toor Dal']
    },
    {
        id: 'bk_4', title: 'Masala Omelette', region: 'North', type: 'non-veg', calories: 250, protein: 14, carbs: 4, fat: 18,
        cookTime: 10, tags: ['breakfast', 'high-protein'], ingredients: ['Eggs', 'Onion', 'Tomato', 'Coriander']
    },
    {
        id: 'bk_5', title: 'Oats Upma', region: 'North', type: 'veg', calories: 260, protein: 9, carbs: 40, fat: 7,
        cookTime: 15, tags: ['breakfast', 'fiber'], ingredients: ['Oats', 'Carrots', 'Peas', 'Curry Leaves']
    },

    // LUNCH
    {
        id: 'ln_1', title: 'Rajma Chawal', region: 'North', type: 'veg', calories: 450, protein: 16, carbs: 70, fat: 12,
        cookTime: 45, tags: ['lunch', 'comfort'], ingredients: ['kidney beans', 'rice', 'onion', 'tomato puree']
    },
    {
        id: 'ln_2', title: 'Grilled Chicken Salad', region: 'North', type: 'non-veg', calories: 380, protein: 35, carbs: 12, fat: 18,
        cookTime: 25, tags: ['lunch', 'high-protein'], ingredients: ['chicken breast', 'lettuce', 'cucumber', 'olive oil']
    },
    {
        id: 'ln_3', title: 'Dal Tadka & Roti', region: 'North', type: 'veg', calories: 380, protein: 14, carbs: 55, fat: 10,
        cookTime: 30, tags: ['lunch', 'staple'], ingredients: ['Toor Dal', 'Wheat Flour', 'Ghee', 'Cumin']
    },
    {
        id: 'ln_4', title: 'Curd Rice', region: 'South', type: 'veg', calories: 320, protein: 8, carbs: 45, fat: 10,
        cookTime: 10, tags: ['lunch', 'gut-health'], ingredients: ['Rice', 'Yogurt', 'Pomegranate', 'Mustard Seeds']
    },
    {
        id: 'ln_5', title: 'Paneer Bhurji Wrap', region: 'North', type: 'veg', calories: 400, protein: 18, carbs: 35, fat: 20,
        cookTime: 20, tags: ['lunch', 'quick'], ingredients: ['Paneer', 'Wheat Chapati', 'Capsicum', 'Onion']
    },

    // SNACKS (Mid-Morning / Evening)
    {
        id: 'sn_1', title: 'Roasted Makhana', region: 'North', type: 'veg', calories: 120, protein: 4, carbs: 20, fat: 3,
        cookTime: 5, tags: ['snack', 'light'], ingredients: ['Foxnuts', 'Ghee', 'Black Salt']
    },
    {
        id: 'sn_2', title: 'Fruit Chaat', region: 'North', type: 'veg', calories: 100, protein: 1, carbs: 24, fat: 0,
        cookTime: 10, tags: ['snack', 'refreshing'], ingredients: ['Apple', 'Papaya', 'Chaat Masala', 'Lemon']
    },
    {
        id: 'sn_3', title: 'Boiled Egg Whites', region: 'North', type: 'non-veg', calories: 52, protein: 11, carbs: 0, fat: 0,
        cookTime: 10, tags: ['snack', 'protein'], ingredients: ['Eggs', 'Black Pepper']
    },
    {
        id: 'sn_4', title: 'Sprouts Salad', region: 'North', type: 'veg', calories: 150, protein: 10, carbs: 22, fat: 2,
        cookTime: 10, tags: ['snack', 'fiber'], ingredients: ['Mixed Sprouts', 'Cucumber', 'Tomato', 'Lemon']
    },

    // DINNER
    {
        id: 'dn_1', title: 'Palak Paneer', region: 'North', type: 'veg', calories: 350, protein: 16, carbs: 12, fat: 25,
        cookTime: 30, tags: ['dinner', 'keto-friendly'], ingredients: ['Spinach', 'Paneer', 'Cream', 'Garlic']
    },
    {
        id: 'dn_2', title: 'Grilled Fish & Veggies', region: 'South', type: 'non-veg', calories: 320, protein: 28, carbs: 10, fat: 14,
        cookTime: 25, tags: ['dinner', 'lean'], ingredients: ['Fish Fillet', 'Broccoli', 'Carrots', 'Lemon Butter']
    },
    {
        id: 'dn_3', title: 'Khichdi', region: 'North', type: 'veg', calories: 300, protein: 10, carbs: 45, fat: 8,
        cookTime: 30, tags: ['dinner', 'light'], ingredients: ['Rice', 'Moong Dal', 'Ghee', 'Turmeric']
    },
    {
        id: 'dn_4', title: 'Chicken Stir Fry', region: 'North', type: 'non-veg', calories: 350, protein: 30, carbs: 15, fat: 12,
        cookTime: 20, tags: ['dinner', 'quick'], ingredients: ['Chicken Breast', 'Bell Peppers', 'Soy Sauce', 'Garlic']
    }
];

// --- CALCULATIONS ---

export const calculateBMR = (weight, height, age, sex) => {
    // Mifflin-St Jeor Equation
    if (sex === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
};

export const calculateTDEE = (bmr, activityLevel) => {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const getTargetCalories = (tdee, goal) => {
    if (goal === 'lose') return Math.max(1200, Math.round(tdee * 0.85)); // 15% deficit, floor 1200
    if (goal === 'gain') return Math.round(tdee * 1.15); // 15% surplus
    return tdee; // Maintenance
};

export const getMacroDistribution = (calories, goal) => {
    // Basic split: Protein guided by goal, Fat fixed %, rest Carbs
    // Note: This is simplified. Real engines use weight-based protein (1.6-2.2g/kg)
    let p_ratio, f_ratio, c_ratio;

    if (goal === 'gain') {
        p_ratio = 0.30; f_ratio = 0.25; c_ratio = 0.45;
    } else if (goal === 'lose') {
        p_ratio = 0.40; f_ratio = 0.30; c_ratio = 0.30;
    } else {
        p_ratio = 0.30; f_ratio = 0.30; c_ratio = 0.40;
    }

    return {
        protein: Math.round((calories * p_ratio) / 4),
        fat: Math.round((calories * f_ratio) / 9),
        carbs: Math.round((calories * c_ratio) / 4)
    };
};

// --- PLAN GENERATION ---

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const filterRecipes = (type, goal, dietary) => {
    // Basic filtering based on tags/types
    let filtered = recipes;
    if (dietary === 'veg') filtered = filtered.filter(r => r.type === 'veg');
    // Add more logic for regions later
    return filtered;
};

export const generateWeeklyPlan = (userStats) => {
    const bmr = calculateBMR(userStats.weight, userStats.height, userStats.age, userStats.sex);
    const tdee = calculateTDEE(bmr, userStats.activity);
    const targetCalories = getTargetCalories(tdee, userStats.goal);
    const macros = getMacroDistribution(targetCalories, userStats.goal);

    const plan = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Filter recipes pools
    const bk_pool = recipes.filter(r => r.tags.includes('breakfast'));
    const ln_pool = recipes.filter(r => r.tags.includes('lunch'));
    const dn_pool = recipes.filter(r => r.tags.includes('dinner'));
    const sn_pool = recipes.filter(r => r.tags.includes('snack'));

    // If veg, filter pools
    // (In a real app, this would be more robust)

    for (let i = 0; i < 7; i++) {
        const dayPlan = {
            day: days[i],
            date: i + 1, // Mock date
            meals: {
                breakfast: getRandomItem(bk_pool),
                lunch: getRandomItem(ln_pool),
                snack: getRandomItem(sn_pool),
                dinner: getRandomItem(dn_pool)
            },
            stats: {
                calories: targetCalories, // Mocking exact hit for now
                macros: macros
            }
        };
        // Recalculate actual totals based on selected meals
        const totalCal =
            dayPlan.meals.breakfast.calories +
            dayPlan.meals.lunch.calories +
            dayPlan.meals.snack.calories +
            dayPlan.meals.dinner.calories;

        dayPlan.actualCalories = totalCal;

        plan.push(dayPlan);
    }

    return {
        userStats: { ...userStats, bmr, tdee, targetCalories },
        targetMacros: macros,
        weeklyPlan: plan
    };
};

export const generateGroceryList = (weeklyPlan) => {
    const list = {};
    weeklyPlan.forEach(day => {
        Object.values(day.meals).forEach(meal => {
            meal.ingredients.forEach(ing => {
                if (list[ing]) list[ing]++;
                else list[ing] = 1;
            });
        });
    });
    return Object.entries(list).map(([name, count]) => ({ name, count }));
};
