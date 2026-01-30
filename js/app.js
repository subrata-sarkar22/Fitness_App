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

function getTodayWorkout() {
  const day = new Date().getDay();
  
  if (userData && userData.weeklySchedule) {
    const workoutId = userData.weeklySchedule[day];
    
    if (workoutId === 'rest') {
      return {
        title: day === 0 ? 'Rest Day' : 'Active Recovery',
        desc: day === 0 ? 'Complete rest & recovery' : '20-30 min • Light Walk',
        icon: day === 0 ? '😴' : '🚶♀️',
        page: '#'
      };
    }
    
    if (workoutData && workoutData.workouts && workoutData.workouts[workoutId]) {
      const w = workoutData.workouts[workoutId];
      return {
        title: w.title,
        desc: `${w.duration} • ${w.description}`,
        icon: w.icon,
        page: `workout.html?id=${workoutId}`
      };
    }
  }
  
  return { title: 'No Workout', desc: 'Rest Day', icon: '😴', page: '#' };
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

function initializeDashboard() {
  // Set today's date
  const dateElement = document.getElementById("today-date");
  if (dateElement) {
    dateElement.textContent = formatDate();
  }

  // Set today's workout
  const workout = getTodayWorkout();
  const todayWorkoutEl = document.getElementById('today-workout');
  
  if (todayWorkoutEl) {
    todayWorkoutEl.innerHTML = `
      <div class="workout-preview">
        <span class="workout-icon">${workout.icon}</span>
        <div>
          <h3>${workout.title}</h3>
          <p>${workout.desc}</p>
        </div>
        <button class="start-btn" onclick="startWorkout()">START</button>
      </div>
    `;
  }

  // Update progress
  updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
  // Only initialize checkboxes here
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
  const checkboxes = document.querySelectorAll(`[data-workout="${workoutType}"]`);
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const total = checkboxes.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const workoutRing = document.getElementById('workout-progress-ring');
  const workoutText = document.getElementById('workout-progress-text');
  
  if (workoutRing && workoutText) {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    
    workoutRing.style.strokeDasharray = circumference;
    workoutRing.style.strokeDashoffset = circumference - (percent / 100) * circumference;
    
    workoutText.textContent = `${percent}%`;
  }

  updateProgress();
}

/* ================================
   USER MANAGEMENT
================================ */

let currentUser = localStorage.getItem('currentUser') || null;

// Show login screen if no user
if (!currentUser) {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); padding: 20px;">
        <div style="background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border-radius: 24px; padding: 40px; max-width: 400px; width: 100%; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05);">
          <h1 style="font-size: 2.5rem; margin: 0 0 8px; color: var(--text);">My FitBit</h1>
          <p style="color: var(--muted); margin: 0 0 32px;">Enter your username to continue</p>
          <input type="text" id="username-input" placeholder="Username" style="width: 100%; padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: var(--text); font-size: 1rem; margin-bottom: 16px; font-family: inherit;" autofocus>
          <button onclick="loginUser()" style="width: 100%; padding: 16px; border-radius: 16px; border: none; background: var(--accent); color: black; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: inherit;">Continue</button>
        </div>
      </div>
    `;
    
    document.getElementById('username-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginUser();
    });
  });
}

function loginUser() {
  const input = document.getElementById('username-input');
  const username = input.value.toLowerCase().trim();
  if (username) {
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    location.reload();
  } else {
    input.style.border = '1px solid #ff453a';
    setTimeout(() => input.style.border = '1px solid rgba(255,255,255,0.1)', 2000);
  }
}

window.loginUser = loginUser;

/* ================================
   WORKOUT DATA LOADER
================================ */

let workoutData = null;
let userData = null;

// Load user data from JSON
async function loadUserData() {
  try {
    console.log('Loading data for user:', currentUser);
    const response = await fetch(`data/${currentUser}.json?t=${Date.now()}`);
    console.log('Fetch response:', response.status, response.ok);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log('Data loaded:', data);
    workoutData = data; // Store entire data object
    userData = { ...data.user, weeklySchedule: data.weeklySchedule };
    console.log('userData:', userData);
    
    // Update UI with user data
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => el.textContent = userData.name);
    
    const weightEl = document.getElementById('user-weight');
    const heightEl = document.getElementById('user-height');
    if (weightEl) weightEl.textContent = userData.weight;
    if (heightEl) heightEl.textContent = userData.height;
    
    // Load workout library
    const libraryEl = document.getElementById('workout-library');
    if (libraryEl && data.workoutLibrary) {
      libraryEl.innerHTML = data.workoutLibrary.map(w => `
        <a href="workout.html?id=${w.id}" class="workout-card">
          <div class="workout-image" style="background-image: url('${w.image}')"></div>
          <div class="workout-info">
            <h3>${w.title}</h3>
            <p>${w.description}</p>
            <span class="duration">${w.duration}</span>
          </div>
        </a>
      `).join('');
    }
    
    // Initialize dashboard after data is loaded
    initializeDashboard();
    
    // Initialize workout page if function exists
    if (typeof initWorkoutPage === 'function') {
      initWorkoutPage();
    }
    
    // Initialize schedule if function exists
    if (typeof initSchedule === 'function') {
      initSchedule();
    }
    
    // Initialize nutrition if function exists
    if (typeof initNutrition === 'function') {
      initNutrition();
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
    console.error('Attempted to load: data/' + currentUser + '.json');
    if (confirm(`User "${currentUser}" not found. Try again?`)) {
      setTimeout(() => loadUserData(), 500);
    } else {
      localStorage.removeItem('currentUser');
      location.reload();
    }
  }
}

// Initialize on page load
if (currentUser) {
  document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
  });
}

// Generate exercise HTML from data
function generateExerciseHTML(exercise, workoutType) {
  const setsReps = exercise.sets && exercise.reps ? `${exercise.sets}×${exercise.reps}` : '';
  const duration = exercise.duration || '';
  
  let weightSpecs = '';
  if (exercise.weights && Object.keys(exercise.weights).length > 0) {
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
  
  const youtubeLink = exercise.youtube ? 
    `<a href="${exercise.youtube}" target="_blank" class="form-link">📹 Watch Form</a>` : '';
  
  return `
    <div class="exercise-item">
      <div class="exercise-header">
        <h3>${exercise.name}</h3>
        <input type="checkbox" data-progress="${exercise.id}" data-workout="${workoutType}">
      </div>
      <div class="exercise-details">
        ${badge}
        ${weightSpecs}
        <p>${exercise.notes}</p>
        ${youtubeLink}
      </div>
    </div>`;
}

// Make function available globally
window.updateWorkoutProgress = updateWorkoutProgress;
window.loadUserData = loadUserData;
window.generateExerciseHTML = generateExerciseHTML;
window.switchUser = function() {
  localStorage.removeItem('currentUser');
  location.reload();
};

/* ================================
   NUTRITION PAGE INITIALIZATION
================================ */

function initNutrition() {
  if (!workoutData || !workoutData.nutrition) {
    setTimeout(initNutrition, 100);
    return;
  }
  
  const nutrition = workoutData.nutrition;
  const user = userData;
  
  // Update subtitle with diet type and training time
  const subtitle = document.getElementById('nutrition-subtitle');
  if (subtitle && user.dietType && user.trainingTime) {
    subtitle.textContent = `${user.dietType} • Training: ${user.trainingTime}`;
  }
  
  // Update title
  const title = document.getElementById('daily-targets-title');
  if (title && user.name) {
    title.textContent = `Daily Targets for ${user.name}`;
  }
  
  // Populate nutrition grid
  const nutritionGrid = document.getElementById('nutrition-grid');
  if (nutritionGrid && nutrition.dailyTargets) {
    const targets = nutrition.dailyTargets;
    let html = '';
    
    if (targets.protein) {
      html += `
        <div class="nutrition-item">
          <div class="nutrition-icon">🥩</div>
          <div class="nutrition-info">
            <h3>Protein</h3>
            <span class="target">${targets.protein.target}</span>
            <p>${targets.protein.perKg || targets.protein.note}</p>
          </div>
        </div>`;
    }
    
    if (targets.water) {
      html += `
        <div class="nutrition-item">
          <div class="nutrition-icon">💧</div>
          <div class="nutrition-info">
            <h3>Water</h3>
            <span class="target">${targets.water.trainingDay || targets.water.base}</span>
            <p>${targets.water.note}</p>
          </div>
        </div>`;
    }
    
    if (targets.sleep) {
      html += `
        <div class="nutrition-item">
          <div class="nutrition-icon">😴</div>
          <div class="nutrition-info">
            <h3>Sleep</h3>
            <span class="target">${targets.sleep.target}</span>
            <p>${targets.sleep.note}</p>
          </div>
        </div>`;
    }
    
    if (targets.calories) {
      const calTarget = targets.calories.trainingDay?.target || targets.calories.weeklyAverageDeficit;
      const calNote = targets.calories.trainingDay?.note || targets.calories.note || 'Calorie management';
      html += `
        <div class="nutrition-item">
          <div class="nutrition-icon">🎯</div>
          <div class="nutrition-info">
            <h3>Calories</h3>
            <span class="target">${calTarget}</span>
            <p>${calNote}</p>
          </div>
        </div>`;
    }
    
    nutritionGrid.innerHTML = html;
  }
  
  // Populate macro breakdown
  const macroBreakdown = document.getElementById('macro-breakdown');
  if (macroBreakdown && nutrition.macroSplit) {
    const macros = nutrition.macroSplit;
    let html = '';
    
    if (macros.protein) {
      html += `
        <div class="macro-item">
          <div class="macro-bar protein">
            <span class="macro-label">Protein</span>
            <span class="macro-percent">${macros.protein.percentage}</span>
          </div>
        </div>`;
    }
    
    if (macros.carbs) {
      html += `
        <div class="macro-item">
          <div class="macro-bar carbs">
            <span class="macro-label">Carbs</span>
            <span class="macro-percent">${macros.carbs.percentage}</span>
          </div>
        </div>`;
    }
    
    if (macros.fats) {
      html += `
        <div class="macro-item">
          <div class="macro-bar fats">
            <span class="macro-label">Fats</span>
            <span class="macro-percent">${macros.fats.percentage}</span>
          </div>
        </div>`;
    }
    
    macroBreakdown.innerHTML = html;
  }
  
  // Populate guidelines
  const guidelines = document.getElementById('guidelines');
  if (guidelines && nutrition.mealTiming) {
    const timing = nutrition.mealTiming;
    let html = '';
    
    if (timing.dailyDistribution) {
      html += `
        <div class="guideline-item">
          <span class="guideline-icon">🍽️</span>
          <div>
            <h3>Meal Distribution</h3>
            <p>${timing.dailyDistribution.proteinPerMeal} protein per meal, ${timing.dailyDistribution.mealsPerDay} meals/day</p>
          </div>
        </div>`;
    }
    
    if (nutrition.foodQualityGuidelines && nutrition.foodQualityGuidelines[0]) {
      const proteins = nutrition.foodQualityGuidelines.find(g => g.id === 'protein-sources');
      if (proteins) {
        html += `
          <div class="guideline-item">
            <span class="guideline-icon">🥦</span>
            <div>
              <h3>${proteins.title}</h3>
              <p>${proteins.items.slice(0, 3).join(', ')}</p>
            </div>
          </div>`;
      }
    }
    
    if (nutrition.foodQualityGuidelines && nutrition.foodQualityGuidelines[2]) {
      const fats = nutrition.foodQualityGuidelines.find(g => g.id === 'fat-sources');
      if (fats) {
        html += `
          <div class="guideline-item">
            <span class="guideline-icon">🥑</span>
            <div>
              <h3>${fats.title}</h3>
              <p>${fats.items.slice(0, 3).join(', ')}</p>
            </div>
          </div>`;
      }
    }
    
    if (timing.postWorkout) {
      html += `
        <div class="guideline-item">
          <span class="guideline-icon">💪</span>
          <div>
            <h3>Post-Workout</h3>
            <p>${timing.postWorkout.guideline} (${timing.postWorkout.timing})</p>
          </div>
        </div>`;
    }
    
    guidelines.innerHTML = html;
  }
  
  // Populate activity target
  const activityTarget = document.getElementById('activity-target');
  if (activityTarget && nutrition.dailyTargets?.dailySteps) {
    const steps = nutrition.dailyTargets.dailySteps;
    activityTarget.innerHTML = `
      <div class="activity-ring">
        <span class="activity-number">${steps.target}</span>
        <span class="activity-label">Steps Daily</span>
      </div>
      <p>${steps.note}</p>`;
  }
  
  // Show food quality guidelines if available
  if (nutrition.foodQualityGuidelines) {
    const card = document.getElementById('food-quality-card');
    const container = document.getElementById('food-quality-guidelines');
    if (card && container) {
      card.style.display = 'block';
      let html = '<div class="guidelines">';
      nutrition.foodQualityGuidelines.forEach(category => {
        html += `
          <div class="guideline-item">
            <span class="guideline-icon">🥗</span>
            <div>
              <h3>${category.title}</h3>
              <p>${category.items.join(', ')}</p>
            </div>
          </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    }
  }
  
  // Show supplements if available
  if (nutrition.supplements) {
    const card = document.getElementById('supplements-card');
    const container = document.getElementById('supplements-list');
    if (card && container) {
      card.style.display = 'block';
      let html = '<div class="guidelines">';
      nutrition.supplements.forEach(supp => {
        html += `
          <div class="guideline-item">
            <span class="guideline-icon">💊</span>
            <div>
              <h3>${supp.name}</h3>
              <p>${supp.dose} • ${supp.purpose}</p>
            </div>
          </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
      
      // Set max-height for smooth transition
      const content = document.getElementById('supplements-content');
      content.style.maxHeight = '0';
      content.classList.add('collapsed');
    }
  }
}

window.initNutrition = initNutrition;
