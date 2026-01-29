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
   WORKOUT DATA LOADER
================================ */

let workoutData = null;
let userData = null;

// Load user data from JSON
async function loadUserData() {
  try {
    const response = await fetch('./data/kajol.json');
    const data = await response.json();
    workoutData = data.workouts;
    userData = data.user;
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
}

// Initialize on page load
loadUserData();

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
window.loadUserData = loadUserData;
window.generateExerciseHTML = generateExerciseHTML;
