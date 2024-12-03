// Sélectionne toutes les images avec la classe "languageFlag"
const languageFlags = document.querySelectorAll(".languageFlag");
var selectedLanguage;
// Ajoute un écouteur d'événement click à chaque image
languageFlags.forEach(flag => {
    if (localStorage.getItem('lang') == flag.id) {
        flag.classList.add('languageFlagSelected');
        selectedLanguage = flag.id;
    }
    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', 'fr-FR');
        document.getElementById('fr-FR').classList.add('languageFlagSelected');
    }
    flag.addEventListener("click", async (event) => {
        const clickedFlag = event.target;
        languageFlags.forEach(flag => {
            flag.classList.remove('languageFlagSelected');
        });
        // Récupère l'identifiant (id) et l'attribut alt de l'image cliquée

        clickedFlag.classList.add('languageFlagSelected');
        localStorage.setItem('lang', clickedFlag.id);
        selectedLanguage = clickedFlag.id;
        location.reload();
    });
});





let canTranslate;
let translator;
var previousLanguage="fr";
const targetLanguage = selectedLanguage.substring(0, 2);
const languagePair = {
    sourceLanguage: "fr",
    targetLanguage: targetLanguage,
};

// Fonction pour configurer le traducteur
async function setupTranslator() {
    try {
        canTranslate = await translation.canTranslate(languagePair);
        if (canTranslate !== 'no') {
            if (canTranslate === 'readily') {
                translator = await translation.createTranslator(languagePair);
            } else {
                translator = await translation.createTranslator(languagePair);
                translator.addEventListener('downloadprogress', (e) => {
                    console.log("Téléchargement :", e.loaded, "/", e.total);
                });
                await translator.ready;
            }
        } else {
            console.error("La traduction n'est pas possible pour cette paire de langues.");
        }
    } catch (error) {
        console.error("Erreur lors de la configuration du traducteur :", error);
    }
}

// Fonction pour traduire un texte
async function translateInnerText(text) {
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

// Fonction pour traduire et mettre à jour les nœuds de texte
async function batchTranslateTextNodes(textNodes) {
    try {
        for (const node of textNodes) {
            const originalText = node.nodeValue.trim();
            if (originalText) {
                const translatedText = await translateInnerText(originalText);
                node.nodeValue = translatedText; // Met à jour directement le contenu du nœud
            }
        }
        document.getElementById('Translator_'+selectedLanguage).style.display = "none";
        document.getElementById('popupGeminiImage').classList.add('popupGeminiButton_unselected')
  
        console.log("Tous les nœuds de texte ont été traduits.");
    } catch (error) {
        console.error("Erreur lors de la traduction des nœuds de texte :", error);
    }
}

// Utilisation principale
async function translateDocument() {
    await setupTranslator(); // Configure le traducteur avant de commencer
    document.getElementById('Translator_'+selectedLanguage).style.display = "block";
   
    document.getElementById('popupGeminiImage').classList.remove('popupGeminiButton_unselected')
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode); // Collecte tous les nœuds de texte
    }

    await batchTranslateTextNodes(textNodes); // Traduit et met à jour les nœuds de texte
};
setupTranslator();
setTimeout(() => {
    if(selectedLanguage !== "fr-FR"){
        translateDocument();
    }
}, 200);

