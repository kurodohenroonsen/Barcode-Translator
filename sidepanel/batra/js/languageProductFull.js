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





let canTranslate2;
let translator2;
var previousLanguage="fr";
const targetLanguage2 = selectedLanguage.substring(0, 2);
const languagePair2 = {
    sourceLanguage: "fr",
    targetLanguage: targetLanguage2,
};

// Fonction pour configurer le traducteur
async function setupTranslator() {
    try {
        canTranslate2 = await translation.canTranslate(languagePair2);
        if (canTranslate2 !== 'no') {
            if (canTranslate2 === 'readily') {
                translator2 = await translation.createTranslator(languagePair2);
            } else {
                translator2 = await translation.createTranslator(languagePair2);
                translator2.addEventListener('downloadprogress', (e) => {
                    console.log("Téléchargement :", e.loaded, "/", e.total);
                });
                await translator2.ready;
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
    if (selectedLanguage !== "fr-FR" && translator2) {
        try {
            const translatedText = await translator2.translate(text);
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
        console.log("Tous les nœuds de texte ont été traduits.");
    } catch (error) {
        console.error("Erreur lors de la traduction des nœuds de texte :", error);
    }
}

// Utilisation principale
async function translateDocument() {
    await setupTranslator(); // Configure le traducteur avant de commencer

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
}, 2000);

