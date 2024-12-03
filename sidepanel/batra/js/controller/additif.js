let db = new Localbase('db');


function addRemoveAdditif(additifId) {
    if ("none" == document.getElementById('additif_container_unselected' + additifId).style.display) {
        db.collection('additif').doc({ code: additifId }).delete();
        document.getElementById('additif_container_unselected' + additifId).style.display = "block";
    } else {
        db.collection('additif').add({
            code: additifId
        }, additifId);

        document.getElementById('additif_container_unselected' + additifId).style.display = "none";
    }
}


async function ChargeAlertAdditif() {
    await db.collection('additif').orderBy('code').get().then(additif => {

        for (var i = 0; i < additif.length; i++) {
            var code = additif[i].code;
            document.getElementById('additif_container_unselected' + code).style.display = "none";
        }
        document.getElementById("loadingPanel").style.display = "none";

    })
}


function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}

function cleRelachee(evt) {
    var filtre = document.getElementById('filtre').value;
    filtre = filtre.toUpperCase();
    var elements = document.getElementsByClassName("parametres_additif_container");
    if (filtre.length > 1) {
        for (i = 0; i < elements.length; i++) {
            if (!elements[i].getAttribute("text").toUpperCase().includes(filtre)) {
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
$(document).ready(function() {
    ChargeAlertAdditif();
    document.getElementById("loadingPanel").style.display = "none";
});