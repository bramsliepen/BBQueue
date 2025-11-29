const trafficLight = document.getElementById('traffic-light');
const message = document.getElementById('message');
const btnSetGo = document.getElementById('set-go');
const btnSetStop = document.getElementById('set-stop');
const btnChangeText = document.getElementById('change-text');

btnSetGo.addEventListener('click', setGo)
btnSetStop.addEventListener('click', setStop)
btnChangeText.addEventListener('click', cycleText)

function setGo(){
    trafficLight.style.backgroundColor = "green"
    setText()
}
function setStop(){
    trafficLight.style.backgroundColor = "red"
    setText()
}

function setText(){
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

function cycleText(){
    if(trafficLight.style.backgroundColor === "green"){
        goIndex = (goIndex + 1) % goTexts.length;
        message.innerText = goTexts[goIndex];
    } else {
        stopIndex = (stopIndex + 1) % stopTexts.length;
        message.innerText = stopTexts[stopIndex];
    }
}