document.body.innerHTML = document.body.innerHTML+ `
<div class="bottomBackground">

</div>
<div class="font-controls" role="group" aria-label="Contrôles de police">
    <button class="font-controls-btn" id="decrease-font" aria-label="Réduire la taille du texte" tabindex="-1">
        <img class="font-controls-img" src="img/logo/logoBatra_minus.png" alt="Réduire la taille du texte">
    </button>
    <button class="font-controls-btn" id="increase-font" aria-label="Agrandir la taille du texte" tabindex="-1">
        <img class="font-controls-img" src="img/logo/logoBatra_plus.png" alt="Agrandir la taille du texte">
    </button>
</div>
<div class="colors-controls" role="group" aria-label="Changer les couleurs de fond et du texte">
    <button class="colors-controls-btn" id="black_yellow_btn" aria-label="Changer les couleurs de fond et du texte" tabindex="-1">
        <img class="colors-controls-img" id="black_yellow_btn_img" src="img/logo/logoBatraBlackYellow.png" alt="Changer les couleurs de fond et du texte">
    </button>
</div>
<div class="bottomEmpty">
</div>

`;

const decreaseBtn = document.getElementById('decrease-font');
const increaseBtn = document.getElementById('increase-font');
const black_yellow_btn = document.getElementById('black_yellow_btn');

decreaseBtn.addEventListener('click', () => {
    if (document.body.style.fontSize) {
        var font_size = document.body.style.fontSize.replace('em', '')
        font_size = parseFloat(font_size) - 0.1;
        localStorage.setItem("font_size", font_size);
        document.body.style.fontSize = font_size + 'em';
    } else {
        localStorage.setItem("font_size", "0.9");
        document.body.style.fontSize = '0.9em';
    }
});

increaseBtn.addEventListener('click', () => {
    if (document.body.style.fontSize) {
        var font_size = document.body.style.fontSize.replace('em', '')
        font_size = parseFloat(font_size) + 0.2;
        localStorage.setItem("font_size", font_size);
        document.body.style.fontSize = font_size + 'em';

    } else {
        localStorage.setItem("font_size", "1.2");
        document.body.style.fontSize = '1.2em';
    }
});
black_yellow_btn.addEventListener('click', () => {
    if (localStorage.getItem("black_yellow_mode") == "true") {
        localStorage.setItem("black_yellow_mode", false);
        location.reload();
    } else {
        localStorage.setItem("black_yellow_mode", true);
        changeStyle();
    }


});
// Appeler la fonction pour appliquer les changements


// Fonction pour changer le style de tous les éléments
function changeStyle() {
    // Sélectionner tous les éléments de la page
    document.getElementById('black_yellow_btn_img').setAttribute('src',"img/logo/logoBatra.png")
    var allElements = document.querySelectorAll('*');

    // Parcourir tous les éléments et changer le style
    allElements.forEach(function (element) {
        var tagName = element.tagName
        if (element.tagName == 'button' || element.tagName == 'BUTTON') {
            element.style.backgroundColor = 'yellow';
        } else if (element.tagName == 'img' || element.tagName == 'IMG') {

        } else if (element.tagName == 'select' || element.tagName == 'SELECT') {
            element.style.background = 'linear-gradient(90deg, black 0%, black 58%, black 100%)';
        } else {
            element.style.backgroundColor = 'black';
        }

        element.style.color = 'yellow';
    });
}
var black_yellow_mode = localStorage.getItem("black_yellow_mode");
if (localStorage.getItem("black_yellow_mode") == "true") {
    changeStyle()
}
if (localStorage.getItem("font_size")) {
    document.body.style.fontSize = localStorage.getItem("font_size") + 'em';
}
