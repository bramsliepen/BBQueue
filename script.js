const trafficLight = document.getElementById('traffic-light');
const message = document.getElementById('message');
const btnSetGo = document.getElementById('set-go');
const btnSetStop = document.getElementById('set-stop');
const btnChangeText = document.getElementById('change-text');

btnSetGo.addEventListener('click', setGo)
btnSetStop.addEventListener('click', setStop)
btnChangeText.addEventListener('click', cycleText)

// ===== GITHUB GIST SYNC VIA ACTIONS =====
// Get Gist ID from environment or config
const GIST_ID = '1f434826b262912d9b2154f29b800b53';
const GIST_RAW_URL = `https://gist.githubusercontent.com/bramsliepen/${GIST_ID}/raw`;
const REPO_OWNER = 'bramsliepen';
const REPO_NAME = 'BBQueue';

let lastSyncedState = null;

// Trigger GitHub Actions workflow to update Gist
async function updateStatusFile() {
    const state = {
        trafficLight: trafficLight.style.backgroundColor,
        messageText: message.innerText
    };

    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_type: 'update-traffic-light',
                    client_payload: {
                        state: JSON.stringify(state, null, 2)
                    }
                })
            }
        );

        if (response.status === 204) {
            console.log('Workflow triggered successfully');
        } else {
            console.warn('Failed to trigger workflow:', response.status, response.statusText);
        }
    } catch (err) {
        console.warn('Could not trigger workflow:', err);
    }
}

// Poll for changes from GitHub Gist
async function pollStatus() {
    try {
        const res = await fetch(GIST_RAW_URL, { cache: 'no-store' });
        if (!res.ok) return;
        const state = await res.json();
        const currentState = JSON.stringify(state);

        if (currentState !== lastSyncedState) {
            lastSyncedState = currentState;
            // Update UI to match the fetched state
            if (state.trafficLight && state.trafficLight !== trafficLight.style.backgroundColor) {
                trafficLight.style.backgroundColor = state.trafficLight;
            }
            if (state.messageText && state.messageText !== message.innerText) {
                message.innerText = state.messageText;
                // Reset indices to 0 after sync
                goIndex = 0;
                stopIndex = 0;
            }
        }
    } catch (err) {
        console.warn('Poll failed:', err);
    }
}

// Start polling every 3 seconds
// setInterval(pollStatus, 3000);

(async () => {
    await pollStatus(); // poll once on load
})();

function setGo() {
    trafficLight.style.backgroundColor = "green"
    setText()
    updateStatusFile()
}
function setStop() {
    trafficLight.style.backgroundColor = "red"
    setText()
    updateStatusFile()
}

function setText() {
    trafficLight.style.backgroundColor === "green" ? message.innerText = goTexts[0] : message.innerText = stopTexts[0];
}

const goTexts = [
    "You can go!",
    "Go ahead!",
    "The path is clear!"
];

const stopTexts = [
    "You must stop!",
    "Stop right there!",
    "Do not proceed!"
];

let goIndex = 0;
let stopIndex = 0;

function cycleText() {
    if (trafficLight.style.backgroundColor === "green") {
        goIndex = (goIndex + 1) % goTexts.length;
        message.innerText = goTexts[goIndex];
    } else {
        stopIndex = (stopIndex + 1) % stopTexts.length;
        message.innerText = stopTexts[stopIndex];
    }
    updateStatusFile()
}

