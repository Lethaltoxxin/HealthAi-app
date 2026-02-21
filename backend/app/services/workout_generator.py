import json
import os
import random
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../data")

class WorkoutGenerator:
    def __init__(self):
        self.exercises = self._load_exercises()

    def _load_exercises(self) -> List[Dict]:
        try:
            path = os.path.join(DATA_DIR, "exercises.json")
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading exercises: {e}")
            return []

    def generate(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a workout plan based on user profile.
        profile: {goal, level, equipment, days_per_week}
        """
        goal = profile.get('goal', 'general')
        level = profile.get('level', 'beginner')
        days = profile.get('days_per_week', 3)
        user_equipment = set(profile.get('equipment', ['Bodyweight']))
        # Always assume Bodyweight is available
        user_equipment.add('Bodyweight')

        # Filter exercises by equipment
        available_exercises = [
            ex for ex in self.exercises 
            if ex['equipment'] in user_equipment or ex['equipment'] == 'Bodyweight'
        ]

        # Define split based on days
        split_map = {
            1: ["Full Body"],
            2: ["Full Body", "Full Body"],
            3: ["Full Body", "Full Body", "Full Body"],
            4: ["Upper Body", "Lower Body", "Upper Body", "Lower Body"],
            5: ["Push", "Pull", "Legs", "Upper Body", "Lower Body"],
            6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs"]
        }
        
        schedule_days = split_map.get(days, split_map[3])
        
        weekly_plan = {}
        day_names = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
        
        for i, focus in enumerate(schedule_days):
            day_name = day_names[i]
            workout = self._create_workout(focus, available_exercises, level, goal)
            weekly_plan[day_name] = {
                "focus": focus,
                "exercises": workout
            }

        return {
            "meta": profile,
            "schedule": weekly_plan
        }

    def _create_workout(self, focus: str, available: List[Dict], level: str, goal: str) -> List[Dict]:
        """
        Create a single day's workout.
        """
        target_exercises = []
        
        # Define movement patterns per focus
        patterns = {
            "Full Body": ["Squat", "Push", "Pull", "Hinge", "Lunge", "Core"],
            "Upper Body": ["Push", "Pull", "Push", "Pull", "Core"],
            "Lower Body": ["Squat", "Hinge", "Lunge", "Squat", "Calves"],
            "Push": ["Push", "Push", "Push", "Triceps", "Shoulders"],
            "Pull": ["Pull", "Pull", "Pull", "Biceps", "Back"],
            "Legs": ["Squat", "Hinge", "Lunge", "Calves", "Glutes"]
        }
        
        # Fallback to Full Body if focus unknown
        required_types = patterns.get(focus, patterns["Full Body"])
        
        for p_type in required_types:
            # Find candidates matching type (loose match) or primary muscle
            candidates = [
                ex for ex in available 
                if ex['type'] == p_type or p_type in ex['primary_muscle']
            ]
            
            if candidates:
                selected = random.choice(candidates)
                # Compute reps/sets based on goal
                sets, reps = self._get_volume(goal, level)
                
                exercise_entry = selected.copy()
                exercise_entry['sets'] = sets
                exercise_entry['reps'] = reps
                target_exercises.append(exercise_entry)
        
        return target_exercises

    def _get_volume(self, goal: str, level: str):
        if goal == 'strength':
            reps = "3-5"
            sets = 4 if level == 'advanced' else 3
        elif goal == 'hypertrophy':
            reps = "8-12"
            sets = 3
        else: # endurance / weight loss
            reps = "15-20"
            sets = 3
            
        return sets, reps

generator = WorkoutGenerator()
