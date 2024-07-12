let totalCalories = 0;
let totalDistance = 0;
let goalCalories = 0;
let goalDistance = 0;
let totalMealCalories = 0;
let dailyCaloriesGoal = 2000;
let hydrationAmount = 0;
const hydrationGoal = 8;

const caloriesChartCtx = document.getElementById('calories-chart').getContext('2d');
const distanceChartCtx = document.getElementById('distance-chart').getContext('2d');
const nutritionChartCtx = document.getElementById('nutrition-chart').getContext('2d');

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

document.getElementById('fitness-form').addEventListener('submit', function (event) {
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
    `;

    sessionList.appendChild(sessionItem);

    totalCalories += calories;
    totalDistance += distance;

    updateProgress();

    document.getElementById('fitness-form').reset();
});

document.getElementById('weight-form').addEventListener('submit', function (event) {
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

document.getElementById('goal-form').addEventListener('submit', function (event) {
    event.preventDefault();

    goalCalories = parseInt(document.getElementById('goal-calories').value) || 0;
    goalDistance = parseFloat(document.getElementById('goal-distance').value) || 0;
    dailyCaloriesGoal = parseInt(document.getElementById('daily-calories-goal').value) || 2000;

    updateProgress();
});

document.getElementById('nutrition-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const mealType = document.getElementById('meal-type').value;
    const mealCalories = parseInt(document.getElementById('meal-calories').value);

    const mealList = document.getElementById('meal-list');
    const mealItem = document.createElement('li');

    mealItem.innerHTML = `
        <strong>${capitalizeFirstLetter(mealType)}</strong><br>
        Calories: ${mealCalories}
    `;

    mealList.appendChild(mealItem);

    totalMealCalories += mealCalories;

    updateProgress();

    document.getElementById('nutrition-form').reset();
});

document.getElementById('sleep-form').addEventListener('submit', function (event) {
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

document.getElementById('increase-hydration').addEventListener('click', function () {
    if (hydrationAmount < hydrationGoal) {
        hydrationAmount++;
        updateHydration();
    }
});

document.getElementById('decrease-hydration').addEventListener('click', function () {
    if (hydrationAmount > 0) {
        hydrationAmount--;
        updateHydration();
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
