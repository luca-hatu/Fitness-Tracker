let totalCalories = 0;
let totalDistance = 0;
let goalCalories = 0;
let goalDistance = 0;
let totalMealCalories = 0;
let dailyCaloriesGoal = 2000;
let hydrationAmount = 0;
const hydrationGoal = 8;

// Macro tracking variables
let totalProteins = 0;
let totalFats = 0;
let totalCarbs = 0;

// Get chart contexts
const caloriesChartCtx = document.getElementById('calories-chart').getContext('2d');
const distanceChartCtx = document.getElementById('distance-chart').getContext('2d');
const nutritionChartCtx = document.getElementById('nutrition-chart').getContext('2d');
const macroChartCtx = document.getElementById('macro-chart').getContext('2d');

// Initialize charts
const caloriesChart = new Chart(caloriesChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Burned', 'Remaining'],
        datasets: [{
            label: 'Calories Burned',
            data: [0, 1],
            backgroundColor: ['#007bff', '#e9ecef'],
            borderWidth: 1
        }]
    }
});

const distanceChart = new Chart(distanceChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Covered', 'Remaining'],
        datasets: [{
            label: 'Distance',
            data: [0, 1],
            backgroundColor: ['#007bff', '#e9ecef'],
            borderWidth: 1
        }]
    }
});

const nutritionChart = new Chart(nutritionChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Consumed', 'Remaining'],
        datasets: [{
            label: 'Nutrition Calories',
            data: [0, dailyCaloriesGoal],
            backgroundColor: ['#007bff', '#e9ecef'],
            borderWidth: 1
        }]
    }
});

const macroChart = new Chart(macroChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Proteins', 'Fats', 'Carbs'],
        datasets: [{
            label: 'Macros',
            data: [0, 0, 0],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
            borderWidth: 1
        }]
    }
});

// Event listener for macro form submission
document.getElementById('macro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const proteins = parseInt(document.getElementById('protein').value) || 0;
    const fats = parseInt(document.getElementById('fat').value) || 0;
    const carbs = parseInt(document.getElementById('carbs').value) || 0;

    totalProteins += proteins;
    totalFats += fats;
    totalCarbs += carbs;

    updateMacroChart();

    document.getElementById('macro-form').reset();
});

function updateMacroChart() {
    macroChart.data.datasets[0].data = [totalProteins, totalFats, totalCarbs];
    macroChart.update();
}

// Existing event listeners and functions...
document.getElementById('fitness-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.querySelector('input[name="activity"]:checked').value;
    const calories = parseInt(document.getElementById('calories').value) || 0;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const memo = document.getElementById('memo').value;
    const energyLevel = document.querySelector('input[name="energy-level"]:checked').value || 1; // Default to level 1 if not selected

    const sessionList = document.getElementById('session-list');
    const sessionItem = document.createElement('li');

    sessionItem.innerHTML = `
        <strong>${capitalizeFirstLetter(activity)}</strong><br>
        Calories: ${calories}, Distance: ${distance} km<br>
        Energy Level: ${energyLevel}<br>
        Memo: ${memo}
        <button class="remove-btn">Remove</button>
    `;

    sessionList.appendChild(sessionItem);

    totalCalories += calories;
    totalDistance += distance;

    updateProgress();

    document.getElementById('fitness-form').reset();
});

document.getElementById('weight-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const weightInput = document.getElementById('weight');
    const weight = parseFloat(weightInput.value);

    if (!isNaN(weight)) {
        const enteredWeight = document.getElementById('entered-weight');
        enteredWeight.textContent = `${weight} kg`;

        weightInput.value = '';
    } else {
        alert('Please enter a valid weight.');
    }
});

document.getElementById('goal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    goalCalories = parseInt(document.getElementById('goal-calories').value) || 0;
    goalDistance = parseFloat(document.getElementById('goal-distance').value) || 0;
    dailyCaloriesGoal = parseInt(document.getElementById('daily-calories-goal').value) || 2000;

    updateProgress();
});

document.getElementById('nutrition-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const mealType = document.getElementById('meal-type').value;
    const mealCalories = parseInt(document.getElementById('meal-calories').value);

    const mealList = document.getElementById('meal-list');
    const mealItem = document.createElement('li');

    mealItem.innerHTML = `
        <strong>${capitalizeFirstLetter(mealType)}</strong><br>
        Calories: ${mealCalories}
        <button class="remove-btn">Remove</button>
    `;

    mealList.appendChild(mealItem);

    totalMealCalories += mealCalories;

    updateProgress();

    document.getElementById('nutrition-form').reset();
});

document.getElementById('sleep-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const sleepStart = new Date(document.getElementById('sleep-start').value);
    const sleepEnd = new Date(document.getElementById('sleep-end').value);

    const sleepDurationMs = sleepEnd - sleepStart;
    const sleepDurationHours = sleepDurationMs / (1000 * 60 * 60);

    const sleepList = document.getElementById('sleep-list');
    const sleepItem = document.createElement('li');

    sleepItem.innerHTML = `
        <strong>Sleep Duration:</strong> ${sleepDurationHours.toFixed(2)} hours<br>
        <strong>Sleep Start:</strong> ${sleepStart.toLocaleString()}<br>
        <strong>Sleep End:</strong> ${sleepEnd.toLocaleString()}
    `;

    sleepList.appendChild(sleepItem);

    document.getElementById('sleep-form').reset();
});

document.getElementById('increase-hydration').addEventListener('click', function() {
    if (hydrationAmount < hydrationGoal) {
        hydrationAmount++;
        updateHydration();
    }
});

document.getElementById('decrease-hydration').addEventListener('click', function() {
    if (hydrationAmount > 0) {
        hydrationAmount--;
        updateHydration();
    }
});

document.getElementById('session-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const sessionItem = event.target.parentElement;
        const sessionList = document.getElementById('session-list');
        const caloriesText = sessionItem.innerHTML.match(/Calories: (\d+)/);
        const distanceText = sessionItem.innerHTML.match(/Distance: ([\d.]+)/);

        const calories = caloriesText ? parseInt(caloriesText[1]) : 0;
        const distance = distanceText ? parseFloat(distanceText[1]) : 0;

        sessionList.removeChild(sessionItem);
        totalCalories -= calories;
        totalDistance -= distance;
        updateProgress();
    }
});

document.getElementById('meal-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const mealItem = event.target.parentElement;
        const mealList = document.getElementById('meal-list');
        const caloriesText = mealItem.innerHTML.match(/Calories: (\d+)/);

        const mealCalories = caloriesText ? parseInt(caloriesText[1]) : 0;

        mealList.removeChild(mealItem);
        totalMealCalories -= mealCalories;
        updateProgress();
    }
});

function updateProgress() {
    updateChartData(caloriesChart, totalCalories, goalCalories);
    updateChartData(distanceChart, totalDistance, goalDistance);
    updateChartData(nutritionChart, totalMealCalories, dailyCaloriesGoal);

    const caloriesProgress = document.getElementById('calories-progress');
    const distanceProgress = document.getElementById('distance-progress');
    const nutritionProgress = document.getElementById('nutrition-progress');

    caloriesProgress.textContent = `Calories Burned: ${totalCalories}/${goalCalories}`;
    distanceProgress.textContent = `Distance: ${totalDistance}/${goalDistance} km`;
    nutritionProgress.textContent = `Calories Consumed: ${totalMealCalories}/${dailyCaloriesGoal}`;

    caloriesProgress.style.color = (totalCalories >= goalCalories && goalCalories > 0) ? 'green' : 'black';
    distanceProgress.style.color = (totalDistance >= goalDistance && goalDistance > 0) ? 'green' : 'black';
    nutritionProgress.style.color = (totalMealCalories >= dailyCaloriesGoal && dailyCaloriesGoal > 0) ? 'green' : 'black';
}

function updateHydration() {
    const hydrationStatus = document.getElementById('hydration-amount');
    const hydrationBar = document.getElementById('hydration-bar');
    hydrationStatus.textContent = hydrationAmount;
    hydrationBar.style.width = `${(hydrationAmount / hydrationGoal) * 100}%`;
}

function updateChartData(chart, value, goal) {
    chart.data.datasets[0].data = [value, Math.max(goal - value, 0)];
    chart.update();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
