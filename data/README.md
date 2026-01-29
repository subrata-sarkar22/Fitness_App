# Fitness App - User Data Template Guide

## Quick Start
1. Copy `template.json` and rename it to `yourname.json` (e.g., `john.json`)
2. Fill in your personal information and workout details
3. Save the file in the `data/` folder

## File Structure

### 1. User Information
```json
"user": {
  "name": "Your Name",
  "age": "30",
  "weight": "70",
  "weightUnit": "kg",
  "height": "5'8",
  "heightCm": "173 cm",
  "goal": "Your fitness goal here"
}
```

### 2. Weekly Schedule
Map days (0=Sunday, 1=Monday, etc.) to workout IDs:
```json
"weeklySchedule": {
  "1": "lower-body",
  "2": "upper-body",
  "3": "cardio-abs",
  "4": "legs-glutes",
  "5": "full-body",
  "6": "rest",
  "0": "rest"
}
```

### 3. Workout Library
Keep the same structure, update titles/descriptions if needed:
```json
{
  "id": "lower-body",
  "title": "Lower Body Power",
  "description": "Squats • Hip Thrusts • Core",
  "duration": "45-50 min",
  "image": "assets/images/lower.jpg"
}
```

### 4. Exercises
Each exercise needs:
- **id**: Unique identifier (e.g., "lower-squat")
- **name**: Exercise name
- **type**: warmup | main | core | abs | cardio | cooldown
- **sets**: Number of sets (e.g., "3") or "" for time-based
- **reps**: Repetitions (e.g., "10-12") or "" for time-based
- **duration**: Time (e.g., "5-10 min") or "" for rep-based
- **weights**: Object with equipment options
- **notes**: Form tips and instructions
- **youtube**: Video tutorial link

#### Example Exercise:
```json
{
  "id": "lower-squat",
  "name": "Squat/Goblet Squat",
  "type": "main",
  "sets": "3",
  "reps": "10–12",
  "duration": "",
  "weights": {
    "dumbbell": "4-6 kg at chest",
    "barbell": "15-20 kg total"
  },
  "notes": "Comfortable depth, knees tracking over toes",
  "youtube": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

## Exercise Types
- **warmup**: Warm-up exercises
- **main**: Primary strength exercises
- **core**: Core/ab exercises
- **abs**: Dedicated ab circuit
- **cardio**: Cardio exercises
- **cooldown**: Cool-down/stretching

## Tips
- Use empty string "" for fields that don't apply (e.g., sets for cardio)
- Keep workout IDs consistent across weeklySchedule, workoutLibrary, and workouts
- Find YouTube videos and replace VIDEO_ID with actual video ID
- Weight format: "X-Y kg" or descriptive text
- Use • (bullet) to separate items in descriptions

## Need Help?
Refer to `kajol.json` for a complete working example.
