document.getElementById('fitness-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.querySelector('input[name="activity"]:checked').value;
    const calories = document.getElementById('calories').value;
    const distance = document.getElementById('distance').value;
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

    document.getElementById('fitness-form').reset();
});
