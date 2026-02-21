import pytest
from app.services.workout_generator import generator

def test_load_exercises():
    assert len(generator.exercises) > 0
    assert generator.exercises[0].get('id') is not None

def test_generate_3_day_split():
    profile = {
        "goal": "strength",
        "level": "intermediate",
        "days_per_week": 3,
        "equipment": ["Dumbbells"]
    }
    plan = generator.generate(profile)
    
    assert len(plan['schedule']) == 3
    # Check if days are named correctly (Day 1, Day 2, etc.) or just random keys?
    # Implementation uses "Day 1", "Day 2", etc.
    assert "Day 1" in plan['schedule']
    assert plan['schedule']['Day 1']['focus'] == "Full Body"

def test_generate_5_day_split():
    profile = {
        "goal": "hypertrophy",
        "level": "advanced",
        "days_per_week": 5,
        "equipment": ["Barbell", "Dumbbells"]
    }
    plan = generator.generate(profile)
    
    assert len(plan['schedule']) == 5
    # Day 1 -> Push, Day 2 -> Pull, Day 3 -> Legs
    assert plan['schedule']['Day 1']['focus'] == "Push"
    assert plan['schedule']['Day 3']['focus'] == "Legs"

def test_equipment_filtering():
    # Only Bodyweight
    profile = {
        "goal": "general",
        "level": "beginner",
        "days_per_week": 3,
        "equipment": [] 
    }
    plan = generator.generate(profile)
    
    day1_exercises = plan['schedule']['Day 1']['exercises']
    for ex in day1_exercises:
        assert ex['equipment'] == "Bodyweight"

def test_volume_strength():
    profile = {
        "goal": "strength",
        "level": "intermediate",
        "days_per_week": 3,
        "equipment": ["Barbell"]
    }
    plan = generator.generate(profile)
    
    day1_exercises = plan['schedule']['Day 1']['exercises']
    if day1_exercises:
        assert day1_exercises[0]['reps'] == "3-5"

def test_volume_hypertrophy():
    profile = {
        "goal": "hypertrophy",
        "level": "intermediate",
        "days_per_week": 3,
        "equipment": ["Dumbbells"]
    }
    plan = generator.generate(profile)
    
    day1_exercises = plan['schedule']['Day 1']['exercises']
    if day1_exercises:
        assert day1_exercises[0]['reps'] == "8-12"
