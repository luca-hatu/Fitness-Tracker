let totalCalories = 0;
let totalDistance = 0;
let goalCalories = 0;
let goalDistance = 0;
let totalMealCalories = 0;
let dailyCaloriesGoal = 2000;

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

document.getElementById('fitness-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.querySelector('input[name="activity"]:checked').value;
    const calories = parseInt(document.getElementById('calories').value) || 0;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const memo = document.getElementById('memo').value;

    const sessionList = document.getElementById('session-list');
    const sessionItem = document.createElement('li');

    sessionItem.innerHTML = `
        <strong>${activity.charAt(0).toUpperCase() + activity.slice(1)}</strong><br>
        Calories: ${calories}, Distance: ${distance} km<br>
        Memo: ${memo}
    `;

    sessionList.appendChild(sessionItem);

    totalCalories += calories;
    totalDistance += distance;

    updateProgress();

    document.getElementById('fitness-form').reset();
});

document.getElementById('goal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    goalCalories = parseInt(document.getElementById('goal-calories').value) || 0;
    goalDistance = parseFloat(document.getElementById('goal-distance').value) || 0;
    dailyCaloriesGoal = parseInt(document.getElementById('daily-calories-goal').value) || 2000; // Default if not set

    updateProgress();
});

document.getElementById('nutrition-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const mealType = document.getElementById('meal-type').value;
    const mealCalories = parseInt(document.getElementById('meal-calories').value);

    const mealList = document.getElementById('meal-list');
    const mealItem = document.createElement('li');

    mealItem.innerHTML = `
        <strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong><br>
        Calories: ${mealCalories}
    `;

    mealList.appendChild(mealItem);

    totalMealCalories += mealCalories;

    updateProgress();

    document.getElementById('nutrition-form').reset();
});

function updateProgress() {
    const remainingCalories = goalCalories - totalCalories > 0 ? goalCalories - totalCalories : 0;
    const remainingDistance = goalDistance - totalDistance > 0 ? goalDistance - totalDistance : 0;
    const remainingMealCalories = goalCalories - totalMealCalories > 0 ? goalCalories - totalMealCalories : 0;

    caloriesChart.data.datasets[0].data = [totalCalories, remainingCalories];
    distanceChart.data.datasets[0].data = [totalDistance, remainingDistance];
    nutritionChart.data.datasets[0].data = [totalMealCalories, remainingMealCalories];

    caloriesChart.update();
    distanceChart.update();
    nutritionChart.update();

    const caloriesProgress = document.getElementById('calories-progress');
    const distanceProgress = document.getElementById('distance-progress');
    const nutritionProgress = document.getElementById('nutrition-progress');

    caloriesProgress.textContent = `Calories Burned: ${totalCalories}/${goalCalories}`;
    distanceProgress.textContent = `Distance: ${totalDistance}/${goalDistance} km`;
    nutritionProgress.textContent = `Calories Consumed: ${totalMealCalories}/${goalCalories}`;

    if (totalCalories >= goalCalories && goalCalories > 0) {
        caloriesProgress.style.color = 'green';
    } else {
        caloriesProgress.style.color = 'black';
    }

    if (totalDistance >= goalDistance && goalDistance > 0) {
        distanceProgress.style.color = 'green';
    } else {
        distanceProgress.style.color = 'black';
    }

    if (totalMealCalories >= goalCalories && goalCalories > 0) {
        nutritionProgress.style.color = 'green';
    } else {
        nutritionProgress.style.color = 'black';
    }
}

