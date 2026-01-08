/* ================================
   LOCAL PROGRESS STORAGE
================================ */

function saveProgress(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProgress(key) {
  return JSON.parse(localStorage.getItem(key)) || false;
}

/* ================================
   WORKOUT SCHEDULE & TODAY'S WORKOUT
================================ */

const workoutSchedule = {
  1: { // Monday
    title: "Lower Body Power",
    desc: "45-50 min • Strength Training",
    icon: "🏋️",
    page: "lower-body.html"
  },
  2: { // Tuesday
    title: "Upper Body Strength",
    desc: "45-50 min • Chest, Back & Arms",
    icon: "💪",
    page: "upper-body.html"
  },
  3: { // Wednesday
    title: "Cardio + Abs",
    desc: "30-35 min • HIIT & Core",
    icon: "🔥",
    page: "cardio-abs.html"
  },
  4: { // Thursday
    title: "Legs & Glutes",
    desc: "45-50 min • Lower Body Focus",
    icon: "🍑",
    page: "legs-glutes.html"
  },
  5: { // Friday
    title: "Full Body Blast",
    desc: "50-55 min • Total Body",
    icon: "⚡",
    page: "full-body.html"
  },
  6: { // Saturday
    title: "Active Recovery",
    desc: "20-30 min • Light Walk",
    icon: "🚶‍♀️",
    page: "#"
  },
  0: { // Sunday
    title: "Rest Day",
    desc: "Complete rest & recovery",
    icon: "😴",
    page: "#"
  }
};

function getTodayWorkout() {
  const day = new Date().getDay();
  return workoutSchedule[day] || workoutSchedule[1];
}

function formatDate() {
  const today = new Date();
  const options = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  return today.toLocaleDateString('en-US', options);
}

function startWorkout() {
  const workout = getTodayWorkout();
  if (workout.page !== "#") {
    window.location.href = workout.page;
  }
}

/* ================================
   CHECKBOX HANDLING
================================ */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-progress]").forEach(box => {
    const key = box.dataset.progress;
    box.checked = loadProgress(key);

    box.addEventListener("change", () => {
      saveProgress(key, box.checked);
      box.closest(".workout-item")?.classList.toggle("done", box.checked);
      updateProgress();
    });

    if (box.checked) {
      box.closest(".workout-item")?.classList.add("done");
    }
  });
});

/* ================================
   DASHBOARD INITIALIZATION
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Set today's date
  const dateElement = document.getElementById("today-date");
  if (dateElement) {
    dateElement.textContent = formatDate();
  }

  // Set today's workout
  const workout = getTodayWorkout();
  const titleElement = document.getElementById("workout-title");
  const descElement = document.getElementById("workout-desc");
  const iconElement = document.querySelector(".workout-icon");

  if (titleElement) titleElement.textContent = workout.title;
  if (descElement) descElement.textContent = workout.desc;
  if (iconElement) iconElement.textContent = workout.icon;

  // Update progress
  updateProgress();
});

/* ================================
   PROGRESS CALCULATION
================================ */

function updateProgress() {
  // Get all workout checkboxes
  const allWorkouts = [
    'lower-body-complete',
    'upper-body-complete', 
    'cardio-abs-complete',
    'legs-glutes-complete',
    'full-body-complete'
  ];

  const completed = allWorkouts.filter(key => loadProgress(key)).length;
  const total = allWorkouts.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update progress ring
  const ring = document.querySelector(".progress");
  const text = document.getElementById("progress-percent");
  const completedElement = document.getElementById("completed-workouts");
  const streakElement = document.getElementById("streak-days");

  if (ring && text) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;

    text.textContent = `${percent}%`;
  }

  if (completedElement) {
    completedElement.textContent = completed;
  }

  if (streakElement) {
    streakElement.textContent = calculateStreak();
  }
}

/* ================================
   STREAK CALCULATION
================================ */

function calculateStreak() {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Check last 30 days for workout completion
  for (let i = 0; i < 30; i++) {
    const dateKey = `workout-${currentDate.toISOString().split('T')[0]}`;
    if (loadProgress(dateKey)) {
      streak++;
    } else if (streak > 0) {
      break; // Streak broken
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/* ================================
   WORKOUT COMPLETION TRACKING
================================ */

function markWorkoutComplete(workoutType) {
  const today = new Date().toISOString().split('T')[0];
  const workoutKey = `${workoutType}-complete`;
  const dateKey = `workout-${today}`;
  
  saveProgress(workoutKey, true);
  saveProgress(dateKey, true);
  
  updateProgress();
}

/* ================================
   COLLAPSIBLE SECTIONS (LEGACY)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".collapsible").forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.classList.toggle("open");
      header.querySelector("span").textContent =
        content.classList.contains("open") ? "Hide" : "Show";
    });
  });
});

/* ================================
   GLOBAL FUNCTIONS
================================ */

/* ================================
   WORKOUT PROGRESS TRACKING
================================ */

function updateWorkoutProgress(workoutType) {
  const checkboxes = document.querySelectorAll(`[data-progress^="${workoutType}-"]`);
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const total = checkboxes.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const ring = document.getElementById(`${workoutType}-progress-ring`);
  const text = document.getElementById(`${workoutType}-progress-text`);

  if (ring && text) {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;

    text.textContent = `${percent}%`;
  }

  // Update main progress when individual workout progress changes
  updateProgress();
}

/* ================================
   WORKOUT DATA (EMBEDDED)
================================ */

const workoutData ={
  "workouts": {
    "lower-body": {
      "title": "Lower Body Power",
      "duration": "45-50 min",
      "description": "Strength Training",
      "exercises": [
        {
          "id": "lower-warmup",
          "name": "Brisk walk/cycle",
          "type": "warmup",
          "sets": "",
          "reps": "",
          "duration": "5-10 min",
          "weights": {},
          "notes": "Easy pace, gradually increase speed",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        },
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
          "youtube": "https://www.youtube.com/watch?v=MeIiIdhvXT4"
        },
        {
          "id": "lower-legpress",
          "name": "Leg Press",
          "type": "main",
          "sets": "3",
          "reps": "10–12",
          "duration": "",
          "weights": {
            "machine": "30-40 kg total"
          },
          "notes": "Slow, controlled movement",
          "youtube": "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
        },
        {
          "id": "lower-hipthrust",
          "name": "Glute Bridge/Hip Thrust",
          "type": "main",
          "sets": "3",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "dumbbell": "6-10 kg plate/DB on hips",
            "barbell": "20-25 kg bar across hips"
          },
          "notes": "Squeeze glutes at top, 1 sec pause",
          "youtube": "https://www.youtube.com/watch?v=LM8XHLYJoYs"
        },
        {
          "id": "lower-hamstring",
          "name": "Hamstring Curl/RDL",
          "type": "main",
          "sets": "3",
          "reps": "10–12",
          "duration": "",
          "weights": {
            "dumbbell": "4-6 kg/hand",
            "barbell": "20-25 kg Romanian deadlift"
          },
          "notes": "Slow control, feel hamstrings",
          "youtube": "https://www.youtube.com/watch?v=0z8p0U6jJ4E"
        },
        {
          "id": "lower-calf",
          "name": "Standing Calf Raise",
          "type": "main",
          "sets": "3",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "bodyweight": "→ 2-4 kg/hand when easy",
            "barbell": "15-20 kg bar"
          },
          "notes": "Hold top 1 sec, full range",
          "youtube": "https://www.youtube.com/watch?v=-M4-G8p8fmc"
        },
        {
          "id": "lower-crunch",
          "name": "Crunch",
          "type": "core",
          "sets": "3",
          "reps": "12–15",
          "duration": "",
          "weights": {},
          "notes": "Lower back lightly pressed, slow",
          "youtube": "https://www.youtube.com/watch?v=Xyd_fa5zoEU"
        },
        {
          "id": "lower-deadbug",
          "name": "Dead Bug/Bird Dog",
          "type": "core",
          "sets": "3",
          "reps": "8–10/side",
          "duration": "",
          "weights": {},
          "notes": "Focus on core control",
          "youtube": "https://www.youtube.com/watch?v=4XLEnwUr1d8"
        }
      ]
    },
    "upper-body": {
      "title": "Upper Body Strength",
      "duration": "45-50 min",
      "description": "Chest, Back & Arms",
      "exercises": [
        {
          "id": "upper-warmup",
          "name": "Brisk walk warm-up",
          "type": "warmup",
          "sets": "",
          "reps": "",
          "duration": "5-10 min",
          "weights": {},
          "notes": "Gradual pace increase",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        },
        {
          "id": "upper-chest",
          "name": "Chest Press",
          "type": "main",
          "sets": "3",
          "reps": "8–12",
          "duration": "",
          "weights": {
            "dumbbell": "3-4 kg/hand",
            "barbell": "15-20 kg total"
          },
          "notes": "Push elbows back, squeeze chest",
          "youtube": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
        },
        {
          "id": "upper-row",
          "name": "Lat Pulldown/Row",
          "type": "main",
          "sets": "3",
          "reps": "8–12",
          "duration": "",
          "weights": {
            "dumbbell": "3-4 kg/hand DB row",
            "barbell": "20 kg barbell row"
          },
          "notes": "Squeeze shoulder blades, controlled",
          "youtube": "https://www.youtube.com/watch?v=CAwf7n6Luuc"
        },
        {
          "id": "upper-shoulder",
          "name": "Shoulder Press",
          "type": "main",
          "sets": "2-3",
          "reps": "10–12",
          "duration": "",
          "weights": {
            "dumbbell": "2-3 kg/hand",
            "barbell": "15 kg bar only"
          },
          "notes": "Do not arch lower back",
          "youtube": "https://www.youtube.com/watch?v=B-aVuyhvLHU"
        },
        {
          "id": "upper-biceps",
          "name": "Biceps Curl",
          "type": "main",
          "sets": "2-3",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "dumbbell": "2-3 kg/hand"
          },
          "notes": "No swinging, full range",
          "youtube": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
        },
        {
          "id": "upper-triceps",
          "name": "Triceps Extension",
          "type": "main",
          "sets": "2-3",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "pushdown": "2-3 kg/hand kickback"
          },
          "notes": "Controlled, no momentum",
          "youtube": "https://www.youtube.com/watch?v=2-LAMcpzODU"
        },
        {
          "id": "upper-cardio",
          "name": "Easy Walk/Cycle",
          "type": "cooldown",
          "sets": "",
          "reps": "",
          "duration": "10-20 min",
          "weights": {},
          "notes": "Conversational pace, bring heart rate down",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        }
      ]
    },
    "cardio-abs": {
      "title": "Cardio + Abs",
      "duration": "30-35 min",
      "description": "HIIT & Core Circuit",
      "exercises": [
        {
          "id": "cardio-main",
          "name": "Brisk Walk/Cycle",
          "type": "cardio",
          "sets": "",
          "reps": "",
          "duration": "25-30 min",
          "weights": {},
          "notes": "RPE 6-7/10, slightly breathless but can speak",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        },
        {
          "id": "cardio-crunch",
          "name": "Reverse Crunch",
          "type": "abs",
          "sets": "3",
          "reps": "12–15",
          "duration": "",
          "weights": {},
          "notes": "Controlled up/down, lower back pressed",
          "youtube": "https://www.youtube.com/watch?v=hyv14e2QDq0"
        },
        {
          "id": "cardio-taps",
          "name": "Heel Taps/Toe Taps",
          "type": "abs",
          "sets": "3",
          "reps": "12–15/side",
          "duration": "",
          "weights": {},
          "notes": "Lying on back, alternate legs slowly",
          "youtube": "https://www.youtube.com/watch?v=5xWzU7bL5xQ"
        },
        {
          "id": "cardio-plank",
          "name": "Side Plank",
          "type": "abs",
          "sets": "2-3",
          "reps": "20–30 sec/side",
          "duration": "",
          "weights": {},
          "notes": "On knees or feet, straight line, core tight",
          "youtube": "https://www.youtube.com/watch?v=K2VljzCC16g"
        },
        {
          "id": "cardio-cooldown",
          "name": "Gentle Stretching",
          "type": "cooldown",
          "sets": "",
          "reps": "",
          "duration": "5 min",
          "weights": {},
          "notes": "Focus on legs, hips, and core",
          "youtube": "https://www.youtube.com/watch?v=sTxC3J3gQEU"
        }
      ]
    },
    "legs-glutes": {
      "title": "Legs & Glutes",
      "duration": "45-50 min",
      "description": "Lower Body Focus",
      "exercises": [
        {
          "id": "legs-warmup",
          "name": "Brisk walk/cycle warm-up",
          "type": "warmup",
          "sets": "",
          "reps": "",
          "duration": "5-10 min",
          "weights": {},
          "notes": "Easy pace",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        },
        {
          "id": "legs-lunge",
          "name": "Walking Lunge/Split Squat",
          "type": "main",
          "sets": "3",
          "reps": "8–10/leg",
          "duration": "",
          "weights": {
            "bodyweight": "→ 3-4 kg/hand",
            "barbell": "15-20 kg bar on back (if stable)"
          },
          "notes": "Step length natural, front knee 90°",
          "youtube": "https://www.youtube.com/watch?v=QOVaHwm-Q6U"
        },
        {
          "id": "legs-extension",
          "name": "Leg Extension",
          "type": "main",
          "sets": "3",
          "reps": "10–12",
          "duration": "",
          "weights": {
            "machine": "10-15 kg stack"
          },
          "notes": "Do not lock knees",
          "youtube": "https://www.youtube.com/watch?v=YyvSfVjQeL0"
        },
        {
          "id": "legs-hipthrust",
          "name": "Hip Thrust/Cable Kickback",
          "type": "main",
          "sets": "3",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "dumbbell": "8-12 kg DB/plate thrust",
            "cable": "5-8 kg kickback"
          },
          "notes": "Focus on glute activation",
          "youtube": "https://www.youtube.com/watch?v=LM8XHLYJoYs"
        },
        {
          "id": "legs-raise",
          "name": "Side-lying Leg Raise",
          "type": "main",
          "sets": "3",
          "reps": "15/side",
          "duration": "",
          "weights": {
            "ankle": "1-2 kg ankle weight if available"
          },
          "notes": "Slow, controlled, feel outer hip",
          "youtube": "https://www.youtube.com/watch?v=KFYgDqB2q3k"
        },
        {
          "id": "legs-plank",
          "name": "Plank on Elbows",
          "type": "core",
          "sets": "2-3",
          "reps": "20–30 sec",
          "duration": "",
          "weights": {},
          "notes": "Core tight, no sagging, straight line",
          "youtube": "https://www.youtube.com/watch?v=pSHjTRCQxIw"
        }
      ]
    },
    "full-body": {
      "title": "Full Body Blast",
      "duration": "50-55 min",
      "description": "Total Body Workout",
      "exercises": [
        {
          "id": "full-warmup",
          "name": "Brisk walk warm-up",
          "type": "warmup",
          "sets": "",
          "reps": "",
          "duration": "5-10 min",
          "weights": {},
          "notes": "Gradual pace increase",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        },
        {
          "id": "full-squat",
          "name": "Squat/Leg Press",
          "type": "main",
          "sets": "3",
          "reps": "8–10",
          "duration": "",
          "weights": {
            "goblet": "4-6 kg at chest",
            "barbell": "20 kg back squat"
          },
          "notes": "Slightly heavier load than Day 1",
          "youtube": "https://www.youtube.com/watch?v=MeIiIdhvXT4"
        },
        {
          "id": "full-row",
          "name": "Row (Machine/DB/Bar)",
          "type": "main",
          "sets": "3",
          "reps": "8–12",
          "duration": "",
          "weights": {
            "dumbbell": "3-4 kg/hand DB row",
            "barbell": "20 kg barbell row"
          },
          "notes": "Squeeze shoulder blades",
          "youtube": "https://www.youtube.com/watch?v=CAwf7n6Luuc"
        },
        {
          "id": "full-chest",
          "name": "Chest Press/Bench Press",
          "type": "main",
          "sets": "3",
          "reps": "8–12",
          "duration": "",
          "weights": {
            "dumbbell": "3-4 kg/hand",
            "barbell": "15-20 kg bar bench"
          },
          "notes": "Push elbows back, controlled",
          "youtube": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
        },
        {
          "id": "full-lateral",
          "name": "Lateral Raise/Front Raise",
          "type": "main",
          "sets": "2",
          "reps": "12–15",
          "duration": "",
          "weights": {
            "dumbbell": "1-2 kg/hand"
          },
          "notes": "Light, high reps",
          "youtube": "https://www.youtube.com/watch?v=3VcKaXpzqRo"
        },
        {
          "id": "full-knee",
          "name": "Standing Knee Raises",
          "type": "core",
          "sets": "2-3",
          "reps": "15/side",
          "duration": "",
          "weights": {},
          "notes": "Core focus, no swinging, controlled",
          "youtube": "https://www.youtube.com/watch?v=7QFJ5H9y1x8"
        },
        {
          "id": "full-cooldown",
          "name": "Easy Walk/Cycle",
          "type": "cooldown",
          "sets": "",
          "reps": "",
          "duration": "10-15 min",
          "weights": {},
          "notes": "Bring heart rate down gradually",
          "youtube": "https://www.youtube.com/watch?v=3WUtJxLv-wI"
        }
      ]
    }
  }
};

// Generate exercise HTML from data
function generateExerciseHTML(exercise, workoutType) {
  const setsReps = exercise.sets && exercise.reps ? `${exercise.sets}×${exercise.reps}` : '';
  const duration = exercise.duration || '';
  
  let weightSpecs = '';
  if (Object.keys(exercise.weights).length > 0) {
    weightSpecs = '<div class="weight-specs">';
    for (const [type, value] of Object.entries(exercise.weights)) {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      weightSpecs += `
        <div class="weight-option">
          <span class="weight-label">${label}</span>
          <span class="weight-value">${value}</span>
        </div>`;
    }
    weightSpecs += '</div>';
  }
  
  const badge = setsReps ? `<span class="sets">${setsReps}</span>` : 
                duration ? `<span class="duration">${duration}</span>` : '';
  
  return `
    <div class="exercise-item">
      <div class="exercise-header">
        <h3>${exercise.name}</h3>
        <input type="checkbox" data-progress="${exercise.id}" onchange="updateWorkoutProgress('${workoutType}')">
      </div>
      <div class="exercise-details">
        ${badge}
        ${weightSpecs}
        <p>${exercise.notes}</p>
        <a href="${exercise.youtube}" target="_blank" class="form-link">📹 Watch Form</a>
      </div>
    </div>`;
}

// Make function available globally
window.updateWorkoutProgress = updateWorkoutProgress;
window.loadWorkoutData = loadWorkoutData;
window.generateExerciseHTML = generateExerciseHTML;
