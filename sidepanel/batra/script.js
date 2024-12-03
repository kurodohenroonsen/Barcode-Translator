/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { marked } from "./js/marked.esm.js";
import DOMPurify from "./js/purify.es.mjs";
import { eld } from './js/languageDetector.js' // Update path.

const SYSTEM_PROMPT = "You are a helpful and friendly assistant.";

(async () => {



  const searchEngine = {
    "Google search": { "url": "https://www.google.com/search?" },
    "DuckDuckGo": { "url": "https://duckduckgo.com/?q=", "querySelectorAll": "[data-layout='organic']" }
  }
  const canSummarize = await ai.summarizer.capabilities();
  console.log("canSummarize : " + canSummarize.available);
  let summarizer;
  if (canSummarize && canSummarize.available !== 'no') {
    if (canSummarize.available === 'readily') {
      // The summarizer can immediately be used.
      summarizer = await ai.summarizer.create({ type: 'key-points', format: 'markdown', length: 'long' });
    } else {
      // The summarizer can be used after the model download.
      summarizer = await ai.summarizer.create();

      await summarizer.ready;
    }
  } else {
    // The summarizer can't be used at all.
  }
  var selectedSearchEngine = "DuckDuckGo";
  var promptNotFound = ""
  var textarea;
  async function gtinNotFound(gtin) {
    var popupDialog = document.getElementById("popupDialog");
    promptNotFound = `Explain the product's history in a kid-friendly way, list benefits and drawbacks, analyze suitability for general use, then share 2 full recipes  or usages and 4 alternatives. Keep blocks concise and TTS-friendly in style. input :`
    var buttonLaunchGemini = document.createElement('button');
    buttonLaunchGemini.classList.add("title");
    buttonLaunchGemini.innerHTML = await translateMessage("Lancer Gemini Nano");
    textarea = document.createElement('textarea');
    textarea.innerHTML = await translateMessage(promptNotFound);
    textarea.style.width = "90%"
    popupDialog.prepend(textarea);
    var etapes = document.createElement('p');
    etapes.innerHTML = await translateMessage(`4. Nous allons appliquer le prompt suivant pour demander plus d'infos sur ce produit avec le résumé généré comme input.`);
    popupDialog.prepend(etapes);
    etapes = document.createElement('p');
    etapes.innerHTML = await translateMessage(`3. Gemini Nano en fera un résumé.`);
    popupDialog.prepend(etapes);
    etapes = document.createElement('p');
    etapes.innerHTML = await translateMessage(`2. Nous allons extraire des informations et Gemini Nano les traduira si necessaire.`);
    popupDialog.prepend(etapes);
    etapes = document.createElement('p');
    etapes.innerHTML = await translateMessage(`1. Nous allons ouvrir, dans un nouvelle page, une recherche DuckDUckGo sur base de ce code barre.`);
    popupDialog.prepend(etapes);

    const message = document.createElement('h3');
    message.innerHTML = await translateMessage(`GTIN inconnu dans nos bases de données, Gemini va butiner internet pour quand même te donner de l'information sur ce produit entre tes mains`);
    popupDialog.prepend(message);

    const searchURL = `${searchEngine['DuckDuckGo']['url']}${gtin}`;
    chrome.runtime.sendMessage({ type: "open-search-tab", url: searchURL });

    popupDialog.show();
    document.getElementById("modalContainer").style.display = "block";
  }

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "analyze-search-content") {
      // Créer un DOMParser pour analyser le code HTML
      const parser = new DOMParser();
      var allCardText = "";
      const doc = parser.parseFromString(message.content, "text/html");

      var searchCards = doc.querySelectorAll(searchEngine[selectedSearchEngine]["querySelectorAll"]);
      var cpt = 1;
      var newStory = "";
      for (const searchCard of searchCards) {

        var cleanText = searchCard.innerText;
        var resultDetectLanguage = 'ja';//eld.detect(cleanText);

        if ("en" != 'ja') {
          var languagePair = {
            sourceLanguage: 'ja', // Or detect the source language with the Language Detection API
            targetLanguage: 'en',
          };
          console.log("detected language : " + 'ja');
          canTranslate = await translation.canTranslate(languagePair);
          console.log(`can translate ${'ja'}->en : ${canTranslate}`);
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
          console.log('ja' + " : " + cleanText);
          cleanText = await translator.translate(cleanText);
          console.log("en : " + cleanText)
        }
        newStory += " | " + cleanText;
      }
      allCardText += newStory;


    }
    console.log("before summarize card : " + allCardText)
    cleanText = await summarizer.summarize(allCardText);
    console.log("after summarize card : " + allCardText)
    promptNotFound += newStory;
    textarea.innerHTML = promptNotFound;
  });


  // Fonction pour traduire un texte
  async function translateMessage(text) {
    if (selectedLanguage !== "fr-FR" && translator) {
      try {
        const translatedText = await translator.translate(text);
        return translatedText;
      } catch (error) {
        console.error("Erreur lors de la traduction :", error);
        return text; // Retourne le texte d'origine en cas d'erreur
      }
    }
    return text; // Pas de traduction si la langue est identique
  }


  const notFound = document.getElementById("notFound");

  notFound.addEventListener("click", async (event) => {
    await gtinNotFound(event.target.getAttribute('data'));
  });









  const errorMessage = document.getElementById("error-message");
  const costSpan = document.getElementById("cost");
  const promptArea = document.getElementById("prompt-area");
  const problematicArea = document.getElementById("problematic-area");
  const promptInput = document.getElementById("prompt-input");
  const responseArea = document.getElementById("response-area");
  const copyLinkButton = document.getElementById("copy-link-button");
  const resetButton = document.getElementById("reset-button");
  const copyHelper = document.querySelector("small");
  const rawResponse = document.querySelector("details div");
  const rawResponseNew = document.getElementById('rawResponseNew');
  const form = document.querySelector("form");
  const maxTokensInfo = document.getElementById("max-tokens");
  const temperatureInfo = document.getElementById("temperature");
  const tokensLeftInfo = document.getElementById("tokens-left");
  const tokensSoFarInfo = document.getElementById("tokens-so-far");
  const topKInfo = document.getElementById("top-k");
  const sessionTemperature = document.getElementById("session-temperature");
  const sessionTopK = document.getElementById("session-top-k");
  const selectedLanguage = localStorage.getItem('lang');

  responseArea.style.display = "none";
  // Crée une instance de MutationObserver
  let geminiBlok = [];
  let speakBlok = [];
  let lastSpokenIndex = -1; // Indice du dernier bloc parlé
  let lastBlockTimeout; // Timer pour le dernier bloc

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach(mutation => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        console.log("Le contenu du div a changé !");

        // Extrait uniquement le texte brut sans balises <br>
        const rawText = rawResponseNew.innerHTML.replace(/<br\s*\/?>/gi, " "); // Remplace les <br> par un espace
        console.log("Texte brut extrait :", rawText);

        // Divise le contenu sur ".", ",", et ":" uniquement
        const currentBlok = rawText
          .split(/[\.\!\:]/) // Divise sur les caractères ".", ",", ":"
          .map(part => part.trim()) // Supprime les espaces autour
          .filter(block => block.length > 0); // Supprime les blocs vides

        // Si au moins deux blocs complets existent
        if (currentBlok.length > 1) {
          // Traite les blocs prêts sauf le dernier en construction
          const blocksToSpeak = currentBlok.slice(lastSpokenIndex + 1, currentBlok.length - 1);
          blocksToSpeak.forEach(block => speakBlok.push(block));

          // Démarre la synthèse vocale pour les blocs prêts
          if (speakBlok.length > 0) {
            speakBlok.forEach(block => speak(block));
            speakBlok = []; // Vide la liste après traitement
          }

          // Met à jour l'indice du dernier bloc parlé
          lastSpokenIndex = currentBlok.length - 2;

          // Vérifie le dernier bloc en construction
          if (lastBlockTimeout) {
            clearTimeout(lastBlockTimeout); // Réinitialise le timer si le div change
          }

          lastBlockTimeout = setTimeout(() => {
            // Traite le dernier bloc si aucune mutation ne se produit pendant un délai
            const lastBlock = currentBlok[currentBlok.length - 1];
            if (lastBlock && currentBlok.length > lastSpokenIndex + 1) {
              speak(lastBlock);
              lastSpokenIndex = currentBlok.length - 1;
              console.log("Dernier bloc lu :", lastBlock);
            }
          }, 500); // Attendre 500ms pour s'assurer que le dernier bloc est stable
        }

        // Met à jour l'état actuel
        geminiBlok = currentBlok;
      }
    });
  });



  async function translate(text) {
    if ("en-US" != selectedLanguage) {
      var targetLanguage = selectedLanguage.substring(0, 2);
      var languagePair = {
        sourceLanguage: "en", // Or detect the source language with the Language Detection API
        targetLanguage: targetLanguage,
      };
      canTranslate = await translation.canTranslate(languagePair);
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
      console.log("en : " + text);
      text = await translator.translate(text);
      console.log(targetLanguage + " : " + text);

    }
    return text;
  }
  // Fonction pour convertir le texte en parole
  async function speak(text) {
    text = await translate(text);
    // Configuration de la synthèse vocale
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage; // Langue : "fr-FR" pour français
    utterance.rate = 1; // Vitesse : 1 est normal
    utterance.pitch = 1; // Tonalité : 1 est normal

    // Parler le texte
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => console.log("Speech finished!");
    utterance.onerror = (e) => console.error("Speech error:", e);
  };
  // Options pour observer les changements
  const config = {
    childList: true,       // Surveille les modifications des enfants (ajout/suppression)
    characterData: true,   // Surveille les modifications du texte
    subtree: true          // Surveille les descendants également
  };

  // Démarre l'observation
  observer.observe(rawResponseNew, config);


  let session = null;

  if (!self.ai || !self.ai.languageModel) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`;
    return;
  }

  promptArea.style.display = "block";
  copyLinkButton.style.display = "none";
  copyHelper.style.display = "none";

  const promptModel = async (highlight = false) => {
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    problematicArea.style.display = "none";
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    responseArea.style.display = "block";
    const heading = document.createElement("h3");
    heading.classList.add("prompt", "speech-bubble");
    heading.textContent = prompt;
    responseArea.append(heading);
    const p = document.createElement("p");
    p.classList.add("response", "speech-bubble");
    p.textContent = "Generating response...";
    responseArea.append(p);
    let fullResponse = "";

    try {
      if (!session) {
        await updateSession();
        updateStats();
      }
      const stream = await session.promptStreaming(prompt);

      for await (const chunk of stream) {
        fullResponse = chunk.trim();
        p.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
        rawResponseNew.innerText = fullResponse;
        rawResponseNew.scrollTop = rawResponseNew.scrollHeight;
      }
    } catch (error) {
      p.textContent = `Error: ${error.message}`;
    } finally {
      if (highlight) {
        problematicArea.style.display = "block";
        problematicArea.querySelector("#problem").innerText =
          decodeURIComponent(highlight).trim();
      }
      //copyLinkButton.style.display = "inline-block";
      //copyHelper.style.display = "inline";
      document.getElementById('popupGeminiImage').classList.remove('bumpingImage');
      updateStats();
    }
  };

  const updateStats = () => {
    if (!session) {
      return;
    }
    const { maxTokens, temperature, tokensLeft, tokensSoFar, topK } = session;
    maxTokensInfo.textContent = new Intl.NumberFormat("en-US").format(
      maxTokens,
    );
    (temperatureInfo.textContent = new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 5,
    }).format(temperature)),
      (tokensLeftInfo.textContent = new Intl.NumberFormat("en-US").format(
        tokensLeft,
      ));
    tokensSoFarInfo.textContent = new Intl.NumberFormat("en-US").format(
      tokensSoFar,
    );
    topKInfo.textContent = new Intl.NumberFormat("en-US").format(topK);
  };

  const params = new URLSearchParams(location.search);

  $("#submit-button").on('click', async function (event) {
    event.preventDefault(); // Empêche tout comportement par défaut
    try {
      await promptModel(highlight);
      console.log("Action réussie avec highlight :", highlight);
    } catch (error) {
      console.error("Erreur lors de l'exécution de promptModel :", error);
    }
  });
  const urlPrompt = params.get("prompt");
  const highlight = params.get("highlight");
  if (urlPrompt) {
    promptInput.value = decodeURIComponent(urlPrompt).trim();

  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await promptModel();
  });

  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  promptInput.addEventListener("focus", () => {
    promptInput.select();
  });

  promptInput.addEventListener("input", async () => {
    const value = promptInput.value.trim();
    if (!value) {
      return;
    }
    const cost = await session.countPromptTokens(value);
    if (!cost) {
      return;
    }
    costSpan.textContent = `${cost} token${cost === 1 ? '' : 's'}`;
  });

  const resetUI = () => {
    responseArea.style.display = "none";
    responseArea.innerHTML = "";
    rawResponse.innerHTML = "";
    rawResponseNew.innerHTML = "";
    problematicArea.style.display = "none";
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    maxTokensInfo.textContent = "";
    temperatureInfo.textContent = "";
    tokensLeftInfo.textContent = "";
    tokensSoFarInfo.textContent = "";
    topKInfo.textContent = "";
    promptInput.focus();
  };

  resetButton.addEventListener("click", () => {
    promptInput.value = "";
    resetUI();
    session.destroy();
    session = null;
    updateSession();
  });

  copyLinkButton.addEventListener("click", () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    const url = new URL(self.location.href);
    url.searchParams.set("prompt", encodeURIComponent(prompt));
    const selection = getSelection().toString() || "";
    if (selection) {
      url.searchParams.set("highlight", encodeURIComponent(selection));
    } else {
      url.searchParams.delete("highlight");
    }
    navigator.clipboard.writeText(url.toString()).catch((err) => {
      alert("Failed to copy link: ", err);
    });
    const text = copyLinkButton.textContent;
    copyLinkButton.textContent = "Copied";
    setTimeout(() => {
      copyLinkButton.textContent = text;
    }, 3000);
  });

  const updateSession = async () => {
    session = await self.ai.languageModel.create({
      temperature: Number(sessionTemperature.value),
      topK: Number(sessionTopK.value),
      systemPrompt: SYSTEM_PROMPT,
    });
    resetUI();
    updateStats();
  };

  sessionTemperature.addEventListener("input", async () => {
    await updateSession();
  });

  sessionTopK.addEventListener("input", async () => {
    await updateSession();
  });

  if (!session) {
    const { defaultTopK, maxTopK, defaultTemperature } =
      await self.ai.languageModel.capabilities();
    sessionTemperature.value = defaultTemperature;
    sessionTopK.value = defaultTopK;
    sessionTopK.max = maxTopK;
    await updateSession();
  }
})();


const searchEngine = {
  "Google search": { "url": "https://www.google.com/search?" },
  "DuckDuckGo": { "url": "https://duckduckgo.com/?q=", "querySelectorAll": "[data-layout='organic']" }
}
var selectedSearchEngine = "DuckDuckGo";
var promptNotFound = ""
var textarea;
async function gtinNotFound(gtin) {
  var popupDialog = document.getElementById("popupDialog");
  promptNotFound = `Explain the product's history in a kid-friendly way, list benefits and drawbacks, analyze suitability for general use, then share 2 full  or usage and 4 alternatives. Keep blocks concise and TTS-friendly in style. input :`
  textarea = document.createElement('textarea');
  textarea.innerHTML = await translateMessage(promptNotFound);
  textarea.style.width = "90%"
  popupDialog.prepend(textarea);
  var etapes = document.createElement('p');
  etapes.innerHTML = await translateMessage(`3. Nous allons appliquer le prompt suivant pour demander plus d'infos sur ce produit.`);
  popupDialog.prepend(etapes);
  etapes = document.createElement('p');
  etapes.innerHTML = await translateMessage(`2. Nous allons extraire des informations et les traduires si necessaire.`);
  popupDialog.prepend(etapes);
  etapes = document.createElement('p');
  etapes.innerHTML = await translateMessage(`1. Nous allons ouvrir, dans un nouvelle page, une recherche DuckDUckGo sur base de ce code barre.`);
  popupDialog.prepend(etapes);

  const message = document.createElement('h3');
  message.innerHTML = await translateMessage(`GTIN inconnu dans nos bases de données, Gemini va butiner internet pour quand même te donner de l'information sur ce produit entre tes mains`);
  popupDialog.prepend(message);

  const searchURL = `${searchEngine['DuckDuckGo']['url']}${gtin}`;
  chrome.runtime.sendMessage({ type: "open-search-tab", url: searchURL });

  popupDialog.show();
  document.getElementById("modalContainer").style.display = "block";
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "analyze-search-content") {
    // Créer un DOMParser pour analyser le code HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(message.content, "text/html");

    var searchCards = doc.querySelectorAll(searchEngine[selectedSearchEngine]["querySelectorAll"]);
    var cpt = 1;
    var newStory = "";
    for (const searchCard of searchCards) {

      var cleanText = searchCard.innerText;
      var resultDetectLanguage = eld.detect(cleanText);

      if ("en" != resultDetectLanguage.language) {
        var languagePair = {
          sourceLanguage: resultDetectLanguage.language, // Or detect the source language with the Language Detection API
          targetLanguage: 'en',
        };
        console.log("detected language : " + resultDetectLanguage.language);
        canTranslate = await translation.canTranslate(languagePair);
        console.log(`can translate ${resultDetectLanguage.language}->en : ${canTranslate}`);
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
        console.log(resultDetectLanguage.language + " : " + cleanText);
        cleanText = await translator.translate(cleanText);
        console.log("en : " + cleanText)
      }
      newStory += " | " + cleanText;
    }
    textarea.innerHTML += newStory;

  }
});


// Fonction pour traduire un texte
async function translateMessage(text) {
  if (selectedLanguage !== "fr-FR" && translator) {
    try {
      const translatedText = await translator.translate(text);
      return translatedText;
    } catch (error) {
      console.error("Erreur lors de la traduction :", error);
      return text; // Retourne le texte d'origine en cas d'erreur
    }
  }
  return text; // Pas de traduction si la langue est identique
}