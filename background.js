// --- CONFIGURATION ---
// IMPORTANT: Replace 'YOUR_X_API_BEARER_TOKEN' with your actual X API Bearer Token.
const BEARER_TOKEN = 'YOUR_X_API_BEARER_TOKEN';

// List of handles to monitor
const HANDLES_TO_MONITOR = [
    'RFYouthSports', 'DelhiCapitals', 'MLCSeattleOrcas',
    'SLI_Live', 'GCLlive', 'PrimeVolley',
    'SonySportsNetwk', 'SonyLIV'
];

// A simple dictionary for typo checking. Expand for more accuracy.
const DICTIONARY = new Set([
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "in", "on", "at",
    "to", "for", "of", "with", "by", "i", "you", "he", "she", "it", "we", "they", "its",
    "x", "twitter", "post", "typo", "error", "check", "live", "sports", "youth",
    "delhi", "capitals", "seattle", "orcas", "global", "chess", "league", "prime",
    "volley", "sony", "network", "liv", "reliance", "foundation", "match", "game",
    "team", "player", "win", "watch"
]);

// --- CORE FUNCTIONS ---

// Checks text for a word not in the dictionary
function findTypo(text) {
    // First, remove URLs to avoid flagging parts of a URL as a typo
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textWithoutUrls = text.replace(urlRegex, '');
    const words = textWithoutUrls.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    for (const word of words) {
        // Check if the word is not empty, not in the dictionary, and not a number
        if (word && !DICTIONARY.has(word) && isNaN(word)) {
            return word;
        }
    }
    return null;
}

// Fetches the user ID for a given handle from the X API
async function getUserId(handle) {
    if (BEARER_TOKEN.includes('YOUR_X_API')) {
        console.error('X API Bearer Token is not configured in background.js');
        return null;
    }
    try {
        const url = `https://api.twitter.com/2/users/by/username/${handle}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
        });
        if (!response.ok) throw new Error(`API error fetching user ID: ${response.status}`);
        const data = await response.json();
        return data.data.id;
    } catch (error) {
        console.error(`Error for handle ${handle}:`, error);
        return null;
    }
}

// Fetches the latest tweets for a given user ID
async function getLatestTweets(userId) {
    try {
        const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&exclude=retweets,replies`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
        });
        if (!response.ok) throw new Error(`API error fetching tweets: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error(`Error fetching tweets for user ${userId}:`, error);
        return [];
    }
}

// Displays a Chrome notification to the user
function showNotification(handle, typo, text) {
    const notificationId = `typo-alert-${handle}-${Date.now()}`;
    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: `Typo found in @${handle}'s post!`,
        message: `Potential typo: "${typo}"\nPost: "${text.substring(0, 100)}..."`,
        priority: 2
    });
}

// Main logic to check all handles
async function checkHandles() {
    console.log(`[${new Date().toLocaleTimeString()}] Running typo check...`);
    const { lastCheckedTweetIds = {} } = await chrome.storage.local.get('lastCheckedTweetIds');

    for (const handle of HANDLES_TO_MONITOR) {
        const userId = await getUserId(handle);
        if (!userId) continue;

        const tweets = await getLatestTweets(userId);
        const lastCheckedId = lastCheckedTweetIds[handle] || '0';

        for (const tweet of tweets) {
            // Use BigInt for accurate comparison of large tweet ID numbers
            if (BigInt(tweet.id) > BigInt(lastCheckedId)) {
                const typo = findTypo(tweet.text);
                if (typo) {
                    showNotification(handle, typo, tweet.text);
                }
                // NOTE: Analysis of text within images is an advanced feature.
                // It would require fetching the image and sending it to an AI service (like Gemini)
                // for OCR and analysis, which is beyond the scope of this basic extension.
            }
        }
        
        // Save the ID of the most recent tweet to avoid re-checking it
        if (tweets.length > 0) {
            lastCheckedTweetIds[handle] = tweets[0].id;
        }
    }
    
    await chrome.storage.local.set({ lastCheckedTweetIds });
    console.log("Typo check complete.");
}

// --- EXTENSION EVENT LISTENERS ---

// Run when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("X Typo Monitor has been installed.");
    checkHandles();
    // Set an alarm to run the check periodically every 15 minutes
    chrome.alarms.create('checkHandlesAlarm', { periodInMinutes: 15 });
});

// Run when the 15-minute alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkHandlesAlarm') {
        checkHandles();
    }
});

// Listen for a message from the popup UI to run a manual check
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkNow') {
        checkHandles().then(() => sendResponse({ status: 'Check complete' }));
        return true; // Indicates an asynchronous response
    }
});
