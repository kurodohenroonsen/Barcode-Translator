

const synth = window.speechSynthesis;

const play = document.getElementById("play");

const inputTxt = document.getElementById("txt");
var voiceSelect = document.getElementById("selectedVoice");

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];
let voicesPossible = [];

function populateVoiceList() {
    // Récupère les voix disponibles et les trie par nom
    voices = synth.getVoices().sort((a, b) => {
        const aname = a.name.toUpperCase();
        const bname = b.name.toUpperCase();

        if (aname < bname) {
            return -1;
        } else if (aname === bname) {
            return 0;
        } else {
            return 1;
        }
    });

    // Filtre les voix disponibles en fonction de la langue sélectionnée
    voicesPossible = voices.filter(voice => voice.lang.includes(selectedLanguage));

    // Sauvegarde l'index sélectionné ou revient à l'index 0 par défaut
    const selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = ""; // Réinitialise la liste des options

    // Ajoute les voix filtrées au sélecteur
    for (let i = 0; i < voicesPossible.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voicesPossible[i].name} (${voicesPossible[i].lang})`;

        if (voicesPossible[i].default) {
            option.textContent += " -- DEFAULT";
        }

        option.setAttribute("data-lang", voicesPossible[i].lang);
        option.setAttribute("data-name", voicesPossible[i].name);

        // Ajoute l'option à l'élément select
        voiceSelect.appendChild(option);
    }

    // Réinitialise l'index sélectionné
    voiceSelect.selectedIndex = selectedIndex;
    if (voiceSelect.selectedOptions.length > 0) {
        startPageTTS();
    }
}
populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

async function translateSpeak(text) {

    document.getElementById('popupGeminiImage').classList.remove('popupGeminiButton_unselected')

    console.log("detected language : " + "fr");
    canTranslate = await translation.canTranslate(languagePair);
    console.log(`can translate fr->${targetLanguage} : ${canTranslate}`);
    if (canTranslate !== 'no') {
        if (canTranslate === 'readily') {
            // The translator can immediately be used.
            translator = await translation.createTranslator(languagePair);
        } else {
            // The translator can be used after the model download.
            translator = await translation.createTranslator(languagePair);
            translator.addEventListener('downloadprogress', (e) => {
                console.log(e.loaded, e.total);
            });
            await translator.ready;
        }
    } else {
    }
    console.log("fr" + " : " + text);
    var resultTranslate = await translator.translate(text);
    console.log("en : " + resultTranslate);
    return resultTranslate;
}
function speak(text) {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }


    const utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onend = function (event) {
        console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
        console.error("SpeechSynthesisUtterance.onerror");
    };

    const selectedOption =
        voiceSelect.selectedOptions[0].getAttribute("data-name");

    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
            break;
        }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
}
// Utilisation avec await
async function startPageTTS() {
    var text = pageTTS;
    if (selectedLanguage != "fr-FR") {
        text = await translateSpeak(pageTTS);
    }
    speak(text);
}