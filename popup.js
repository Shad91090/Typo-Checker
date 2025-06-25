document.addEventListener('DOMContentLoaded', () => {
    const handlesList = document.getElementById('handles-list');
    const checkNowButton = document.getElementById('check-now-button');
    const statusEl = document.getElementById('status');

    // This list should match the one in background.js
    const handles = [
        'RFYouthSports', 'DelhiCapitals', 'MLCSeattleOrcas',
        'SLI_Live', 'GCLlive', 'PrimeVolley',
        'SonySportsNetwk', 'SonyLIV'
    ];

    // Populate the list of handles in the UI
    handles.forEach(handle => {
        const li = document.createElement('li');
        li.textContent = `@${handle}`;
        handlesList.appendChild(li);
    });

    // Add click listener to the button
    checkNowButton.addEventListener('click', () => {
        statusEl.textContent = 'Checking in background...';
        checkNowButton.disabled = true;

        // Send a message to the background script to start a manual check
        chrome.runtime.sendMessage({ action: 'checkNow' }, (response) => {
            statusEl.textContent = response.status;
            // Re-enable the button after a short delay
            setTimeout(() => {
                statusEl.textContent = '';
                checkNowButton.disabled = false;
            }, 3000);
        });
    });
});
