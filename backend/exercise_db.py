import random
from typing import List, Dict, Any

# Exercise Catalog (50+ items)
EXERCISE_DB = [
    # --- CHEST / PUSH ---
    {"id": "e_pushup", "title": "Push-ups", "type": "push", "muscle": "chest", "equipment": "none", "difficulty": "beginner", "instructions": "Keep body straight, lower until chest touches floor.", "video": "https://www.youtube.com/watch?v=IODxDxX7oi4"},
    {"id": "e_pushup_knees", "title": "Knee Push-ups", "type": "push", "muscle": "chest", "equipment": "none", "difficulty": "beginner", "instructions": "Easier variation on knees.", "video": "https://www.youtube.com/watch?v=WHIKYjqgdEU"},
    {"id": "e_pushup_incline", "title": "Incline Push-ups", "type": "push", "muscle": "chest", "equipment": "chair", "difficulty": "beginner", "instructions": "Hands on elevated surface.", "video": "https://www.youtube.com/watch?v=Z0bRigOHZSc"},
    {"id": "e_pushup_decline", "title": "Decline Push-ups", "type": "push", "muscle": "chest", "equipment": "chair", "difficulty": "intermediate", "instructions": "Feet on elevated surface.", "video": "https://www.youtube.com/watch?v=SKPab2YC8BE"},
    {"id": "e_dips_chair", "title": "Chair Dips", "type": "push", "muscle": "triceps", "equipment": "chair", "difficulty": "beginner", "instructions": "Lower body using arms on chair edge.", "video": "https://www.youtube.com/watch?v=tKjcgfu44sI"},
    {"id": "e_pike_pushup", "title": "Pike Push-ups", "type": "push", "muscle": "shoulders", "equipment": "none", "difficulty": "intermediate", "instructions": "Hips high, lower head to floor.", "video": "https://www.youtube.com/watch?v=sposDXJOB0A"},
    {"id": "e_burpee", "title": "Burpees", "type": "cardio", "muscle": "full", "equipment": "none", "difficulty": "advanced", "instructions": "Pushup to jump.", "video": "https://www.youtube.com/watch?v=auBLPXO8Fww"},
    {"id": "e_db_press", "title": "Dumbbell Floor Press", "type": "push", "muscle": "chest", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Press weights up while lying on floor.", "video": "https://www.youtube.com/watch?v=uUGDRwge4F8"},
    {"id": "e_db_fly", "title": "Dumbbell Fly", "type": "push", "muscle": "chest", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Open arms wide lying on floor.", "video": "https://www.youtube.com/watch?v=eozdVDA78K0"},
    {"id": "e_db_shoulder_press", "title": "Overhead Press", "type": "push", "muscle": "shoulders", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Press weights overhead standing or seated.", "video": "https://www.youtube.com/watch?v=M2rwvNhTOu0"},

    # --- BACK / PULL ---
    {"id": "e_superman", "title": "Supermans", "type": "pull", "muscle": "back", "equipment": "none", "difficulty": "beginner", "instructions": "Lift arms and legs while lying on stomach.", "video": "https://www.youtube.com/watch?v=cc6UVRS7PW4"},
    {"id": "e_db_row", "title": "Dumbbell Row", "type": "pull", "muscle": "back", "equipment": "dumbbell", "difficulty": "beginner", "instructions": "Bent over, pull weight to hip.", "video": "https://www.youtube.com/watch?v=pYcpY20QaE8"},
    {"id": "e_door_pull", "title": "Doorframe Rows", "type": "pull", "muscle": "back", "equipment": "none", "difficulty": "beginner", "instructions": "Hold door frame, lean back, pull self forward.", "video": "https://www.youtube.com/watch?v=r8Nn-i_YyvY"},
    {"id": "e_renegade_row", "title": "Renegade Row", "type": "pull", "muscle": "back", "equipment": "dumbbell", "difficulty": "advanced", "instructions": "Row while in plank position.", "video": "https://www.youtube.com/watch?v=Fk30UqOpbb0"},
    {"id": "e_db_pullover", "title": "Dumbbell Pullover", "type": "pull", "muscle": "lats", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Lower weight behind head lying down.", "video": "https://www.youtube.com/watch?v=5Y8s8p4X6iY"},

    # --- LEGS ---
    {"id": "e_squat", "title": "Bodyweight Squat", "type": "legs", "muscle": "quads", "equipment": "none", "difficulty": "beginner", "instructions": "Hips back, knees out, chest up.", "video": "https://www.youtube.com/watch?v=YaXPRqUwItQ"},
    {"id": "e_sumo_squat", "title": "Sumo Squat", "type": "legs", "muscle": "glutes", "equipment": "none", "difficulty": "beginner", "instructions": "Wide stance squat.", "video": "https://www.youtube.com/watch?v=9Zu06EbfWww"},
    {"id": "e_lunges", "title": "Reverse Lunges", "type": "legs", "muscle": "legs", "equipment": "none", "difficulty": "beginner", "instructions": "Step back, lower knee.", "video": "https://www.youtube.com/watch?v=7pHWj9O5K28"},
    {"id": "e_lateral_lunge", "title": "Lateral Lunges", "type": "legs", "muscle": "legs", "equipment": "none", "difficulty": "intermediate", "instructions": "Step to side, push hips back.", "video": "https://www.youtube.com/watch?v=FUX6Pz8vV0s"},
    {"id": "e_glute_bridge", "title": "Glute Bridge", "type": "legs", "muscle": "glutes", "equipment": "none", "difficulty": "beginner", "instructions": "Lift hips while lying on back.", "video": "https://www.youtube.com/watch?v=wPM8icPu6H8"},
    {"id": "e_calf_raise", "title": "Calf Raises", "type": "legs", "muscle": "calves", "equipment": "none", "difficulty": "beginner", "instructions": "Lift heels off ground.", "video": "https://www.youtube.com/watch?v=-M4-G8p8fmc"},
    {"id": "e_step_up", "title": "Chair Step-ups", "type": "legs", "muscle": "legs", "equipment": "chair", "difficulty": "intermediate", "instructions": "Step up onto stable chair.", "video": "https://www.youtube.com/watch?v=9ZknE0d33e8"},
    {"id": "e_goblet_squat", "title": "Goblet Squat", "type": "legs", "muscle": "quads", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Squat holding weight at chest.", "video": "https://www.youtube.com/watch?v=MeIiIdhvXT4"},
    {"id": "e_db_rdl", "title": "Dumbbell RDL", "type": "legs", "muscle": "hamstrings", "equipment": "dumbbell", "difficulty": "intermediate", "instructions": "Hinge hips back keeping back flat.", "video": "https://www.youtube.com/watch?v=XyKT8s29Yt8"},
    {"id": "e_wall_sit", "title": "Wall Sit", "type": "legs", "muscle": "quads", "equipment": "none", "difficulty": "beginner", "instructions": "Sit against wall, hold.", "video": "https://www.youtube.com/watch?v=-cdph8hv0O0"},

    # --- CORE ---
    {"id": "e_plank", "title": "Plank", "type": "core", "muscle": "abs", "equipment": "none", "difficulty": "beginner", "instructions": "Hold body straight on elbows.", "video": "https://www.youtube.com/watch?v=ASdvN_XEl_c"},
    {"id": "e_mountain_climber", "title": "Mountain Climbers", "type": "cardio", "muscle": "abs", "equipment": "none", "difficulty": "intermediate", "instructions": "Run knees to chest in plank.", "video": "https://www.youtube.com/watch?v=nmwgirgXLYM"},
    {"id": "e_crunch", "title": "Crunches", "type": "core", "muscle": "abs", "equipment": "none", "difficulty": "beginner", "instructions": "Lift shoulders off floor.", "video": "https://www.youtube.com/watch?v=Xyd_fa5zoEU"},
    {"id": "e_leg_raise", "title": "Leg Raises", "type": "core", "muscle": "abs", "equipment": "none", "difficulty": "intermediate", "instructions": "Lift legs while lying flat.", "video": "https://www.youtube.com/watch?v=l4kQd9eWclE"},
    {"id": "e_bicycle", "title": "Bicycle Crunches", "type": "core", "muscle": "abs", "equipment": "none", "difficulty": "intermediate", "instructions": "Elbow to opposite knee.", "video": "https://www.youtube.com/watch?v=9FGilxCbdz8"},
    {"id": "e_russian_twist", "title": "Russian Twists", "type": "core", "muscle": "abs", "equipment": "none", "difficulty": "intermediate", "instructions": "Twist torso seated.", "video": "https://www.youtube.com/watch?v=wkD8rjkodUI"},

    # --- CARDIO ---
    {"id": "e_jacks", "title": "Jumping Jacks", "type": "cardio", "muscle": "full", "equipment": "none", "difficulty": "beginner", "instructions": "Jump feet wide, hands up.", "video": "https://www.youtube.com/watch?v=2W4ZNSwoW_4"},
    {"id": "e_high_knees", "title": "High Knees", "type": "cardio", "muscle": "legs", "equipment": "none", "difficulty": "intermediate", "instructions": "Run in place lifting knees high.", "video": "https://www.youtube.com/watch?v=8opcQdC-V-U"},
    {"id": "e_skaters", "title": "Skater Jumps", "type": "cardio", "muscle": "legs", "equipment": "none", "difficulty": "intermediate", "instructions": "Jump side to side.", "video": "https://www.youtube.com/watch?v=5V42a0bF6k8"}
]

def get_filtered_exercises(equipment_list, level):
    """
    Filter exercises based on user's equipment and skill level.
    """
    has_db = "dumbbell" in equipment_list
    
    available = []
    for ex in EXERCISE_DB:
        # Check equipment
        if ex['equipment'] == "dumbbell" and not has_db:
            continue
        if ex['equipment'] == "chair":
            # Assume everyone has a chair/bench
            pass
            
        # Check difficulty (simple logic for MVP)
        if level == 'beginner' and ex['difficulty'] == 'advanced':
            continue
            
        available.append(ex)
    return available

def pick_random(pool: List[Dict[str, Any]], type_filter: str) -> Dict[str, Any]:
    candidates = [e for e in pool if e['type'] == type_filter]
    if not candidates:
        # Fallback to any or return empty dict if pool also empty
        return pool[0].copy() if pool else {}
    return random.choice(candidates).copy()

def generate_workout_plan(user_profile):
    """
    Generate a 4-week progressive plan.
    """
    goal = user_profile.get('goal', 'strength')
    level = user_profile.get('level', 'beginner')
    equipment = user_profile.get('equipment', [])
    days_per_week = user_profile.get('days_per_week', 3)
    
    pool = get_filtered_exercises(equipment, level)
    
    # Define schedule days
    days: List[Dict[str, Any]] = []
    
    # Logic for 3 days or less (Full Body) vs Split
    if days_per_week <= 3:
        for i in range(days_per_week):
            # Create explicit list for exercises
            exercises: List[Dict[str, Any]] = []
            exercises.append(pick_random(pool, 'push'))
            exercises.append(pick_random(pool, 'pull'))
            exercises.append(pick_random(pool, 'legs'))
            exercises.append(pick_random(pool, 'legs'))
            exercises.append(pick_random(pool, 'core'))
            exercises.append(pick_random(pool, 'cardio'))
            
            day_plan = {
                "day": i + 1,
                "title": "Full Body Routine",
                "focus": "Full Body",
                "exercises": [e for e in exercises if e] # Filter Empty
            }
            days.append(day_plan)
    else:
        # Upper/Lower Split
        for i in range(days_per_week):
            is_upper = i % 2 == 0
            exercises = []
            
            if is_upper:
                exercises.append(pick_random(pool, 'push'))
                exercises.append(pick_random(pool, 'pull'))
                exercises.append(pick_random(pool, 'push')) # Second push
                exercises.append(pick_random(pool, 'pull')) # Second pull
                exercises.append(pick_random(pool, 'core'))
                title = "Upper Body Strength"
            else:
                exercises.append(pick_random(pool, 'legs'))
                exercises.append(pick_random(pool, 'legs'))
                exercises.append(pick_random(pool, 'legs')) # Volume
                exercises.append(pick_random(pool, 'core'))
                exercises.append(pick_random(pool, 'cardio'))
                title = "Lower Body & Core"

            day_plan = {
               "day": i + 1,
               "title": title,
               "focus": "Upper" if is_upper else "Lower",
               "exercises": [e for e in exercises if e]
            }
            days.append(day_plan)

    # Assign sets/reps based on goal
    set_rep_scheme = {
        "strength": {"sets": 3, "reps": "8-10", "rest": 90},
        "weight_loss": {"sets": 3, "reps": "12-15", "rest": 45},
        "endurance": {"sets": 2, "reps": "15-20", "rest": 30},
        "muscle_gain": {"sets": 4, "reps": "8-12", "rest": 60}
    }
    
    scheme = set_rep_scheme.get(goal, set_rep_scheme['strength'])
    
    # Apply scheme
    for d in days:
        for ex in d['exercises']:
            ex['sets'] = scheme['sets']
            # Cardio usually duration
            if ex.get('type') == 'cardio' or ex.get('id') == 'e_plank':
                 ex['reps'] = "45 sec"
                 ex['sets'] = 3
            else:
                 ex['reps'] = scheme['reps']
            ex['rest'] = scheme['rest']

    return {
        "plan_id": f"w_{random.randint(1000,9999)}",
        "plan_name": f"{days_per_week}-Day {goal.replace('_', ' ').title()} Plan",
        "schedule": days,
        "progression": [
            "Week 1: Focus on form, complete all sets.",
            "Week 2: Add 1 rep to each set or 5 seconds to cardio.",
            "Week 3: Decrease rest time by 10s.",
            "Week 4: Add 1 extra set to main exercises."
        ]
    }
