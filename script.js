let totalCalories = 0;
let totalDistance = 0;
let goalCalories = 0;
let goalDistance = 0;

const caloriesChartCtx = document.getElementById('calories-chart').getContext('2d');
const distanceChartCtx = document.getElementById('distance-chart').getContext('2d');

const caloriesChart = new Chart(caloriesChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Consumed', 'Remaining'],
        datasets: [{
            label: 'Calories',
            data: [0, 1], // Initial values
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
            data: [0, 1], // Initial values
            backgroundColor: ['#007bff', '#e9ecef'],
            borderWidth: 1
        }]
    }
});

document.getElementById('fitness-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.querySelector('input[name="activity"]:checked').value;
    const calories = parseInt(document.getElementById('calories').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const memo = document.getElementById('memo').value;

    const sessionList = document.getElementById('session-list');
    const sessionItem = document.createElement('li');

    let activityIcon;
    switch(activity) {
        case 'run':
            activityIcon = '<i class="fas fa-running"></i>';
            break;
        case 'cycle':
            activityIcon = '<i class="fas fa-biking"></i>';
            break;
        case 'swim':
            activityIcon = '<i class="fas fa-swimmer"></i>';
            break;
    }

    sessionItem.innerHTML = `
        ${activityIcon}
        <strong>${activity.charAt(0).toUpperCase() + activity.slice(1)}</strong><br>
        Calories: ${calories}<br>
        Distance: ${distance} km<br>
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

    updateProgress();
});

function updateProgress() {
    const remainingCalories = goalCalories - totalCalories > 0 ? goalCalories - totalCalories : 0;
    const remainingDistance = goalDistance - totalDistance > 0 ? goalDistance - totalDistance : 0;

    caloriesChart.data.datasets[0].data = [totalCalories, remainingCalories];
    distanceChart.data.datasets[0].data = [totalDistance, remainingDistance];

    caloriesChart.update();
    distanceChart.update();

    const caloriesProgress = document.getElementById('calories-progress');
    const distanceProgress = document.getElementById('distance-progress');

    caloriesProgress.textContent = `Calories: ${totalCalories}/${goalCalories}`;
    distanceProgress.textContent = `Distance: ${totalDistance}/${goalDistance} km`;

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
}

