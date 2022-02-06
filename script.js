const synth = speechSynthesis;

const formEl = document.getElementById('form');
const textInputEl = document.getElementById('textInput');
const rateEl = document.getElementById('rate');
const rateValueEl = document.getElementById('rateValue');
const pitchEl = document.getElementById('pitch');
const pitchValueEl = document.getElementById('pitchValue');
const selectedVoiceEl = document.getElementById('selectedVoice');
const bodyEl = document.querySelector('body');

let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    for (let voice of voices) {
        let optionEl = document.createElement('option');
        optionEl.textContent = voice.name;
        optionEl.setAttribute('data-name',voice.name);
        optionEl.setAttribute('data-lang',voice.lang);
        selectedVoiceEl.appendChild(optionEl);
    }
}

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {

    if (synth.speaking) {
        console.error('Already Speaking...');
        return
    }

    if (textInputEl.value !== "") {

        bodyEl.classList.add('bg-gif');

        const speakText = new SpeechSynthesisUtterance(textInputEl.value);

        speakText.onend = e => {
            console.log('Done Speaking...');
            bodyEl.classList.remove('bg-gif');
        }

        speakText.onerror = e => {
            console.error('Something went wrong...')
        }

        const selectedVoice = selectedVoiceEl.selectedOptions[0].getAttribute('data-name');

        for (let voice of voices) {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        }
    
        speakText.rate = rateEl.value;
        speakText.pitch = pitchEl.value;
    
        synth.speak(speakText);
    }
};

formEl.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInputEl.blur();
});

rateEl.addEventListener('change', e => rateValueEl.textContent = rateEl.value);
pitchEl.addEventListener('change', e => pitchValueEl.textContent = pitchEl.value);

selectedVoiceEl.addEventListener('change', e => speak());