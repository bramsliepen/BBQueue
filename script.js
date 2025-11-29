const trafficLight = document.getElementById('traffic-light');
const message = document.getElementById('message');
const btnSetGo = document.getElementById('set-go');
const btnSetStop = document.getElementById('set-stop');
const btnChangeText = document.getElementById('change-text');

btnSetGo.addEventListener('click', setGo)
btnSetStop.addEventListener('click', setStop)
btnChangeText.addEventListener('click', cycleText)

const GET_STATUS_URL = '/.netlify/functions/get-status';
const UPDATE_FUNCTION_URL = '/.netlify/functions/update-gist';

let lastSyncedState = null;

// Update Gist via Netlify Function
async function updateStatusFile() {
    const state = {
        trafficLight: trafficLight.style.backgroundColor,
        messageText: message.innerText
    };

    try {
        const response = await fetch(UPDATE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state)
        });

        if (response.status === 204) {
            console.log('Gist updated successfully');
        } else {
            console.warn('Failed to update Gist:', response.status);
        }
    } catch (err) {
        console.warn('Could not update Gist:', err);
    }
}

// Poll for changes from Netlify get-status function (returns freshest value)
async function pollStatus() {
    console.log('Polling status from Gist...');
    try {
        // Add a cache-busting query param as extra safety
        const res = await fetch(`${GET_STATUS_URL}?t=${Date.now()}`, { cache: 'no-store' });
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
    cycleText()
}
function setStop() {
    trafficLight.style.backgroundColor = "red"
    cycleText()
}

function setText() {
    trafficLight.style.backgroundColor === "green" ? message.innerText = goTexts[0] : message.innerText = stopTexts[0];
}

const goTexts = [
    "Kom erbij Monique, het is een go, al het vlees ligt al in de kliko!",
    "Geen zorgen Monique, van dit eten wordt jij niet ziek.",
    "Geen vlees te vinden, ben klaar om vega eten te verslinden!",
    "Suikerloze lekkernijen worden gemaakt, door jou wordt niet gebraakt.",
    "Maak je klaar voor een 100% gluten free, smaaksesatie",
    "Rob is bijna klaar bij de gril, dadelijk lekker van bil."
];

const stopTexts = [
    "PAS OP!!! Vlezige praktijken in proces.",
    "Allergie gedetecteerd, maak dat je je omkeert!",
    "Nee nee, dit is enkel voor Rob, helaas niks voor jou mop.",
    "Rob is in zijn element, lekker vrijen moet op een ander moment.",
    "Vega onviendelijke praktijken vinden plaats hier, maar jij bent nog steeds Rob's lievelingsdier.",
    "Rob is bezig met de BBQ, dus zeg maar \"HOUWDOE!\"",
    "Er ligt vlees op de BBQ, dit is enger dan Scooby Doo...",
    "There is meat on the BBQ, but I still love you!"
];

function cycleText() {
    if (trafficLight.style.backgroundColor === "green") {
        message.innerText = goTexts[Math.floor(Math.random() * goTexts.length)];
    } else if (trafficLight.style.backgroundColor === "red") {
        message.innerText = stopTexts[Math.floor(Math.random() * stopTexts.length)];
    } else {
        message.innerText = "Selecteer een status...";
    }
}

