let db = new Localbase('db');


function addRemoveAllergen(allergenId) {
    if (!document.getElementById("img_" + allergenId).classList.contains("allergen_inactif")) {
        db.collection('allergen').doc({ code: allergenId }).delete();
        //document.getElementById('allergen_container_unselected' + allergenId).style.display = "block";
        document.getElementById("img_" + allergenId).classList.remove("allergen_actif");
        document.getElementById("img_" + allergenId).classList.add("allergen_inactif");
        document.getElementById("allergen_container_" + allergenId).classList.remove("parametres_allergen_container_actif");
        document.getElementById("allergen_container_" + allergenId).classList.add("parametres_allergen_container_inactif");

    } else {
        db.collection('allergen').get().then(historique => {
            db.collection('allergen').add({
                code: allergenId
            }, allergenId);
        });
        document.getElementById("img_" + allergenId).classList.add("allergen_actif");
        document.getElementById("img_" + allergenId).classList.remove("allergen_inactif");
        document.getElementById("allergen_container_" + allergenId).classList.add("parametres_allergen_container_actif");
        document.getElementById("allergen_container_" + allergenId).classList.remove("parametres_allergen_container_inactif");
    }
}

async function ChargeAlertAllergen() {
    await db.collection('allergen').orderBy('code').get().then(allergen => {

        for (var i = 0; i < allergen.length; i++) {
            var code = allergen[i].code;
            document.getElementById("img_" + code).classList.add("allergen_actif");
            document.getElementById("img_" + code).classList.remove("allergen_inactif");
            document.getElementById("allergen_container_" + code).classList.add("parametres_allergen_container_actif");
            document.getElementById("allergen_container_" + code).classList.remove("parametres_allergen_container_inactif");
        }


    })
}


function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}

function printAllergens() {
    var allergens_container = document.getElementById("allergens_container")
    var keys = Object.keys(AllergenTypeCodes);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        allergens_container.innerHTML += `					
        <div text="${AllergenTypeCodes[key]['fr']} - ${AllergenTypeCodes[key]['nl']} - ${AllergenTypeCodes[key]['en']}"
            class="parametres_allergen_container parametres_allergen_container_inactif" id="allergen_container_${key}"
            onclick="addRemoveAllergen('${key}');">
            <img id="img_${key}" alt="${AllergenTypeCodes[key]['fr']} - ${AllergenTypeCodes[key]['nl']} - ${AllergenTypeCodes[key]['en']}" title="${AllergenTypeCodes[key]['fr']}"
                class="parametres_allergen_icon allergen_inactif" id="allergen_img_${key}" src="img/allergen/${key}.svg">
        </div>`
    }
}


$(document).ready(function() {
    printAllergens();
    ChargeAlertAllergen();
    document.getElementById("loadingPanel").style.display = "none";
});