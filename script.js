const trafficLight = document.getElementById('traffic-light');
const message = document.getElementById('message');
const btnSetGo = document.getElementById('set-go');
const btnSetStop = document.getElementById('set-stop');
const btnChangeText = document.getElementById('change-text');

btnSetGo.addEventListener('click', setGo)
btnSetStop.addEventListener('click', setStop)
btnChangeText.addEventListener('click', cycleText)

// ===== POLLING & STATE SYNC =====
const STATUS_FILE = './status.json'; // URL to status.json on this page
let lastSyncedState = null;

// Save current state to status.json (via fetch POST or direct write if in Node/SSG)
function updateStatusFile() {
    console.log('Updating status file...');
    const state = {
        trafficLight: trafficLight.style.backgroundColor,
        messageText: message.innerText
    };
    try {
        // For static hosting, you'll need to manually update status.json via git/CI
        // This logs what would be saved (see instructions below)
        console.log('State to save:', state);
        // Store in localStorage as backup (for same-origin polling across tabs)
        localStorage.setItem('trafficLightState', JSON.stringify(state));
    } catch (err) {
        console.warn('Could not save state:', err);
    }
}

// Poll for changes from status.json (useful if another page updates it, or for sync across tabs)
async function pollStatus() {
    console.log('Polling for status updates...');
    try {
        const res = await fetch(STATUS_FILE, { cache: 'no-store' });
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

