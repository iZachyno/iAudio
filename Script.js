const increaseHeightButton = document.getElementById("increaseHeightButton");
const decreaseHeightButton = document.getElementById("decreaseHeightButton");
const bars = document.querySelectorAll(".bar");
const bars_reverse = document.querySelectorAll(".bar-reverse");

const bar1 = (val) =>
{
    const bar = document.getElementById("low");
    const bar1 = document.getElementById("low1");
    bar.style.height = `${val}%`;
    bar1.style.height = `${val}%`;
}
const bar2 = (val) =>
{
    const bar = document.getElementById("mid");
    const bar1 = document.getElementById("mid1");
    bar.style.height = `${val}%`;
    bar1.style.height = `${val}%`;
}
const bar3 = (val) =>
{
    const bar = document.getElementById("high");
    const bar1 = document.getElementById("high1");
    bar.style.height = `${val}%`;
    bar1.style.height = `${val}%`;
}

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const output = document.getElementById("output");
const audioElement = document.createElement("audio");
audioElement.controls = false;
output.appendChild(audioElement);

const lowValue = document.getElementById("lowValue");
const midValue = document.getElementById("midValue");
const highValue = document.getElementById("highValue");

let mediaRecorder;
let audioChunks = [];

async function startRecording() {
const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
});
mediaRecorder = new MediaRecorder(stream);

const audioContext = new (window.AudioContext ||
    window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const source = audioContext.createMediaStreamSource(stream);
source.connect(analyser);
analyser.connect(audioContext.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

audioElement.srcObject = stream;

mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
    audioChunks.push(event.data);
    }
};

mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioElement.src = audioUrl;
};

mediaRecorder.start();
startButton.disabled = true;
stopButton.disabled = false;

function updateFrequencyValues() {
    analyser.getByteFrequencyData(dataArray);
    const lowRange = dataArray.slice(0, dataArray.length / 3);
    const midRange = dataArray.slice(
    dataArray.length / 3,
    (2 * dataArray.length) / 3
    );
    const highRange = dataArray.slice(
    (2 * dataArray.length) / 3,
    dataArray.length
    );
    const getAverage = (array) =>
    array.reduce((a, b) => a + b, 0) / array.length;

    const l = Math.round(getAverage(lowRange));
    const m = Math.round(getAverage(midRange));
    const h = Math.round(getAverage(highRange));
    lowValue.textContent = l;
    midValue.textContent = m;
    highValue.textContent = h;

    bar1((l / 255) * 100)
    bar2((m / 255) * 100)
    bar3((h / 255) * 100)

    requestAnimationFrame(updateFrequencyValues);
}

updateFrequencyValues();
}

function stopRecording() {
mediaRecorder.stop();
startButton.disabled = false;
stopButton.disabled = true;
location.reload();
}

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);