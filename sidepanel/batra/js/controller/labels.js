let db = new Localbase('db');


function addRemoveLabel(labelId) {
    if ("none" == document.getElementById('label_container_unselected' + labelId).style.display) {
        db.collection('label').doc({ code: labelId }).delete();
        document.getElementById('label_container_unselected' + labelId).style.display = "block";
    } else {
        db.collection('label').add({
            code: labelId
        }, labelId);

        document.getElementById('label_container_unselected' + labelId).style.display = "none";
    }
}

function saveScore(score, value) {
    db.collection('score').add({
        code: score,
        value: value
    }, score);

}

async function ChargeAlertLabel() {
    await db.collection('label').orderBy('code').get().then(label => {

        for (var i = 0; i < label.length; i++) {
            var code = label[i].code;
            document.getElementById('label_container_unselected' + code).style.display = "none";
        }
        document.getElementById("loadingPanel").style.display = "none";

    })
}
async function ChargeAlertScore() {
    await db.collection('score').orderBy('code').get().then(score => {

        for (var i = 0; i < score.length; i++) {
            var code = score[i].code.toUpperCase();
            var value = score[i].value;
            var elem = document.getElementById(code + 'Check');
            elem.checked = true;

            elem = document.getElementById(code + 'Img');
            elem.src = "img/score/" + code + "_" + value + ".svg";

            elem = document.getElementById(code);
            elem.value = value;
            var valueSlider = (elem.value - elem.min) / (elem.max - elem.min) * 100
            elem.style.background = 'linear-gradient(to right, #c6cb2e 0%, #c6cb2e ' + valueSlider + '%, #fff ' + valueSlider + '%, white 100%)'

        }

    })
}

function addRemoveScore(checkboxElem, score) {
    var checked = checkboxElem.value;
    if (checked) {
        db.collection('score').doc({ code: score }).delete();
    } else {
        db.collection('score').add({
            code: score,
            value: 0
        }, score);
    }
}

function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}




$(document).ready(function() {
    addListenerToRange('NUTRISCORE');
    addListenerToRange('SIGA');
    addListenerToRange('ECOSCORE');
    addListenerToRange('NOVA');
    ChargeAlertScore();
    ChargeAlertLabel();
    document.getElementById("loadingPanel").style.display = "none";
});

function addListenerToRange(code) {
    let i = document.getElementById(code);


    document.getElementById(code).oninput = function() {
        var value = (this.value - this.min) / (this.max - this.min) * 100
        this.style.background = 'linear-gradient(to right, #c6cb2e 0%, #c6cb2e ' + value + '%, #fff ' + value + '%, white 100%)'
        saveScore(code, this.value);
        elem = document.getElementById(code + 'Img');

        elem.src = "img/score/" + code + "_" + this.value + ".svg";

    };

    // use 'change' instead to see the difference in response
    i.addEventListener('input', function() {


        var checkBox_code = document.getElementById(code + "Check");
        checkBox_code.checked = true;
        saveScore(code, i.value);
    }, false);


}

function cleRelachee(evt) {
    var filtre = document.getElementById('filtre').value;
    filtre = filtre.toUpperCase();
    var elements = document.getElementsByClassName("parametres_label_container");
    if (filtre.length > 1) {
        for (i = 0; i < elements.length; i++) {
            if (!elements[i].innerHTML.includes(filtre)) {
                elements[i].style.display = "none";
            } else {
                elements[i].style.display = "block";
            }
        }
    } else {
        for (i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
    }
}