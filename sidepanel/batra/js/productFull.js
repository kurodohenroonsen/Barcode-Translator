
let jsonProductGlobal;
let db = new Localbase('db_batra_link');
var currentHistories = [];
function updateHistory(productJson) {

    db.collection('app_history').get().then(history => {
        if (history.length > 0) {
            currentHistories = history[0]["histories"];
            if (!currentHistories.includes(productJson)) {
                currentHistories.push(productJson);
            }

            db.collection('app_history').doc({ id: "currentHistory" }).update({
                id: "currentHistory",
                histories: currentHistories
            });
        } else {
            currentHistories.push(productJson);
            db.collection('app_history').add({
                id: "currentHistory",
                histories: currentHistories

            }, "currentHistory");

        }

    });
};
$(document).ready(function () {
    loadJson();
});
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) {
                if ('gtin' === parameterName) {
                    result = decodeURIComponent(tmp[1]);
                    if (result.length == 8) {
                        result = result + "000000";
                    }
                } else {
                    result = decodeURIComponent(tmp[1]);
                }
            }
        });
    return result;
}
var profils_allergens = new Object();
var profils_additifs = new Object();

async function loadProfils() {
    db.collection('profil').get().then(profils => {
        console.log("Profils : ");

        for (var i = 0; i < profils.length; i++) {
            console.log(profils[i]);
            document.getElementById('profilGlobalAvatars').innerHTML += `<img alt="Selectionner ${profils[i]['speudo']}" id="profil_avatar_${profils[i]['id']}" src="img/avatars/${profils[i]['id']}-beige.svg" class="global_profil_avatar" id="profil_avatar_global_${profils[i]['id']}" style="width:40px"><br>`
            document.getElementById('profilAllergensAvatars').innerHTML += `<img alt="Selectionner Allergènes ${profils[i]['speudo']}" src="img/avatars/${profils[i]['id']}-beige.svg" class="profil_avatar profil_avatar_${profils[i]['id']}" style="width:20px" id="profil_avatar_allergens_${profils[i]['id']}">`
            document.getElementById('profilAdditifsAvatars').innerHTML += `<img alt="Selectionner Additifs ${profils[i]['speudo']}" src="img/avatars/${profils[i]['id']}-beige.svg" class="profil_avatar profil_avatar_${profils[i]['id']}" style="width:20px" id="profil_avatar_additifs_${profils[i]['id']}">`
            document.getElementById('profilScoresAvatars').innerHTML += `<img alt="Selectionner Scores ${profils[i]['speudo']}" src="img/avatars/${profils[i]['id']}-beige.svg" class="profil_avatar profil_avatar_${profils[i]['id']}" style="width:20px" id="profil_avatar_scores_${profils[i]['id']}">`
            document.getElementById('alertPositif').innerHTML += `<div style="font-size:0.8em;text-align:left;padding:4px" id="alert_positif_${profils[i]['id']}"><img alt="Alertes positives de ${profils[i]['speudo']}" src="img/avatars/${profils[i]['id']}-beige.svg" class="profil_avatar profil_avatar_${profils[i]['id']}" style="width:20px; display:none" id="profil_avatar_positif_${profils[i]['id']}">
        <div id="alert_positif_scores_${profils[i]['id']}" style="display:none"><b>Scores : </b> </div>
        <div id="alert_positif_nutrient_${profils[i]['id']}" style="display:none"><b>Nutriments : </b> </div>
        </div>`;
            document.getElementById('alertNegatif').innerHTML += `<div style="font-size:0.8em;text-align:left;padding:4px" id="alert_negatif_${profils[i]['id']}"><img alt="Alertes négatives de ${profils[i]['speudo']}"  src="img/avatars/${profils[i]['id']}-beige.svg" class="profil_avatar profil_avatar_${profils[i]['id']}" style="width:20px; display:none" id="profil_avatar_negatif_${profils[i]['id']}">
        <div id="alert_negatif_allergens_${profils[i]['id']}" style="display:none"><b>Allergènes : </b></div>
        <div id="alert_negatif_additifs_${profils[i]['id']}" style="display:none"><b>Additifs : </b></div>
        <div id="alert_negatif_scores_${profils[i]['id']}" style="display:none"><b>Scores : </b> </div>
        <div id="alert_negatif_nutrient_${profils[i]['id']}" style="display:none"><b>Nutriments : </b> </div>
        </div>`;
            if (profils[i]['additifs']) {
                var additifs = profils[i]['additifs']
                for (var j = 0; j < additifs.length; j++) {

                    var additifIcon = document.getElementsByClassName(`additif_circle_${additifs[j]}`);
                    for (var k = 0; k < additifIcon.length; k++) {
                        additifIcon[k].setAttribute('fill', 'red');
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');

                        document.getElementById("profil_avatar_additifs_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`);

                        document.getElementById(`alert_negatif_additifs_${profils[i]['id']}`).style.display = "block";

                        if (document.getElementById(`alert_negatif_additifs_${profils[i]['id']}`).innerHTML.indexOf(`${additifIcon[k].classList[0].split('_')[2]}`) < 0) {
                            document.getElementById(`alert_negatif_additifs_${profils[i]['id']}`).innerHTML += `${additifIcon[k].classList[0].split('_')[2]}, `;
                        }
                    }



                }
            }
            if (profils[i]['allergens']) {
                var allergens = profils[i]['allergens']
                for (var j = 0; j < allergens.length; j++) {
                    console.log(allergens[j]);
                    var allegensIcons = document.getElementsByClassName(allergens[j]);
                    for (var k = 0; k < allegensIcons.length; k++) {
                        allegensIcons[k].classList.add('allergenNotGood');
                        document.getElementById("profil_avatar_allergens_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).style.display = "block";
                        if (allegensIcons[k].classList.contains('imageAllergenMini')) {
                            document.getElementById(`alert_negatif_allergens_${profils[i]['id']}`).style.display = "block";
                            document.getElementById(`alert_negatif_allergens_${profils[i]['id']}`).innerHTML += `<img src="${allegensIcons[k].getAttribute('src')}"  class="imageAllergenMini allergenNotGood"/>`;

                        }
                    }

                }
            }
            var alertButton = document.getElementById("alertButton");
            if (document.getElementById("alertButton").classList.contains('alertRed')) {
                $("#popup_content").show();
                $("#popup").show();
            }


        }
        updateNutrifactProfil();
        updateScoreProfil();
        $('.global_profil_avatar').click(function () {
            var profil_avatars = document.getElementsByClassName("profil_avatar");
            for (var i = 0; i < profil_avatars.length; i++) {
                profil_avatars[i].style.display = 'none';
            }
            profil_avatars = document.getElementsByClassName(this.id);
            for (var i = 0; i < profil_avatars.length; i++) {
                profil_avatars[i].style.display = 'block';
            }
        });


        var asides = document.getElementsByClassName("swipeOptional")
        var contentDiv = document.getElementById("content")
        var ctpVisible = 0;
        for (var i = 0; i < asides.length; i++) {
            if (!asides[i].classList.contains('asideHidden')) {
                var asideClone = asides[i].cloneNode(true);
                contentDiv.removeChild(asides[i]);
                asideClone.classList.remove('swipeOptional')
                asideClone.classList.remove('swipe_left')
                asideClone.classList.remove('swipe_right')
                asides[i].classList.add('asideHidden')
                if (ctpVisible % 2 == 0) {
                    asideClone.classList.add('swipe_left')
                } else {
                    asideClone.classList.add('swipe_right')
                }
                ctpVisible++
                contentDiv.appendChild(asideClone);
            }

        }
        if (window.innerWidth <= 600) {
            $(".swipe").on('click', function (event) {
                $(".swipe").css({
                    "height": "90px",

                });

                $(".swipe").addClass("no-aside");

                if ($(this).hasClass("container_3_left") || $(this).hasClass("container_3_right")) {
                    $(".swipe").removeClass("container_3_left");
                    $(".swipe").removeClass("container_3_right");
                    $(".swipe").removeClass("container_1");
                    $(".swipe_content").hide();

                } else {
                    console.log($(this).width());
                    $(".content").css({
                        "grid-template-columns": "repeat(auto-fit, minmax(" + (($("#product_nutriFacts").width() / 4) - 10) + "px, 1fr))",

                    });
                    this.classList.toggle('no-aside');
                    $(".swipe_content").hide();

                    $(".swipe").removeClass("container_3_left");
                    $(".swipe").removeClass("container_3_right");
                    $(".swipe").removeClass("container_1");

                    if ($(this).hasClass("swipe_left")) {
                        $(this).next().addClass("container_1");
                        $(this).addClass("container_3_left");
                    } else {
                        $(this).prev().addClass("container_1");
                        $(this).addClass("container_3_right");
                    }

                    $(this).children("div").show();
                    $(this).css({
                        "height": "unset",

                    });
                }

            });

        }
        generatePrompt();
    })
}
async function generatePrompt() {


    // Récupère tout le texte, y compris ceux des éléments cachés, sauf dans les <select>
    function getAllTextExcludingSelects(element) {
        let texts = [];
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Récupère le texte brut
                texts.push(node.textContent.trim());
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Vérifie si c'est une image pour récupérer l'attribut alt
                if (node.tagName.toLowerCase() === 'img' && node.alt) {
                    texts.push(`[${node.id} : ${node.alt.trim()}]`); // Ajoute l'attribut alt s'il est présent
                }
                // Ignore les <select> et leurs enfants
                else if (node.tagName.toLowerCase() !== 'select') {
                    texts.push(getAllTextExcludingSelects(node));
                }
            }
        });
        return texts.flat().filter(text => text.length > 0); // Aplatit et nettoie les textes vides

    }

    setTimeout(() => {
        var element = document.getElementById('content');
        const allTexts = getAllTextExcludingSelects(element);
        element = document.getElementById('popup_content');
        allTexts.push(getAllTextExcludingSelects(element))
        console.log(allTexts);


        const separator = '\n'; // Séparateur lisible pour un prompt
        const promptString = allTexts.join(separator);
        translate(promptString)
    }, 1000); // Temps en millisecondes (1000 ms = 1 seconde)


}
function updateScoreProfil() {
    db.collection('profil').get().then(profils => {

        for (var i = 0; i < profils.length; i++) {
            if (profils[i]['NOVA']) {
                var scoreImg = document.getElementById("NOVA");
                if (scoreImg) {


                    var data_value = scoreImg.getAttribute("data-value");
                    switch (data_value) {
                        case 'NOVA_1':
                            data_value = 0;
                            break;
                        case 'NOVA_2':
                            data_value = 1;
                            break;
                        case 'NOVA_3':
                            data_value = 2;
                            break;
                        case 'NOVA_4':
                            data_value = 3;
                            break;

                    }
                    if (data_value >= profils[i]['NOVA']) {
                        scoreImg.classList.add("allergenNotGood");
                        document.getElementById("profil_avatar_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_scores_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');

                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).style.display = "block";
                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" class="allergenNotGood">`;




                    } else {
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-beige.svg`)
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).style.display = "block";
                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" >`;
                    }
                }
            }
            if (profils[i]['NUTRISCORE']) {
                var scoreImg = document.getElementById("NUTRISCORE");
                if (scoreImg) {
                    var data_value = scoreImg.getAttribute("data-value");
                    switch (data_value) {
                        case 'NUTRISCORE_A':
                            data_value = 0;
                            break;
                        case 'NUTRISCORE_B':
                            data_value = 1;
                            break;
                        case 'NUTRISCORE_C':
                            data_value = 2;
                            break;
                        case 'NUTRISCORE_D':
                            data_value = 3;
                            break;
                        case 'NUTRISCORE_E':
                            data_value = 4;
                            break;
                    }
                    if (data_value >= profils[i]['NUTRISCORE']) {
                        scoreImg.classList.add("allergenNotGood");
                        document.getElementById("profil_avatar_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_scores_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');

                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).style.display = "block";
                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" class="allergenNotGood">`;

                    } else {
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-beige.svg`)
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).style.display = "block";
                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" >`;
                    }
                }


            }
            if (profils[i]['ECOSCORE']) {
                var scoreImg = document.getElementById("ECOSCORE");
                if (scoreImg) {
                    var data_value = scoreImg.getAttribute("data-value");
                    switch (data_value) {
                        case 'ECOSCORE_A':
                            data_value = 0;
                            break;
                        case 'ECOSCORE_B':
                            data_value = 1;
                            break;
                        case 'ECOSCORE_C':
                            data_value = 2;
                            break;
                        case 'ECOSCORE_D':
                            data_value = 3;
                            break;
                        case 'ECOSCORE_E':
                            data_value = 4;
                            break;
                    }
                    if (data_value >= profils[i]['ECOSCORE']) {
                        scoreImg.classList.add("allergenNotGood");
                        document.getElementById("profil_avatar_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_scores_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');

                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-rouge.svg`)
                        document.getElementById("profil_avatar_negatif_" + profils[i]['id']).style.display = "block";

                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_negatif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" class="allergenNotGood">`;

                    } else {
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).setAttribute("src", `img/avatars/${profils[i]['id']}-beige.svg`)
                        document.getElementById("profil_avatar_positif_" + profils[i]['id']).style.display = "block";
                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).style.display = "block";

                        document.getElementById(`alert_positif_scores_${profils[i]['id']}`).innerHTML += `<img src="${scoreImg.getAttribute('src')}" style="width:15px" >`;
                    }
                }
            }
        }
    })
}
function updateNutrifactElemProfil(nutrient, nutrientSpan, profil) {
    if (profil[nutrientSpan + "_persoAR"]) {
        if (document.getElementById(nutrientSpan + 'Value')) {

            var quantityInPortion = document.getElementById(nutrientSpan + 'Value').innerHTML;
            var ar = profil[nutrientSpan + "_persoAR"];
            document.getElementById(nutrientSpan + '_arPerso').innerHTML += `<div class="profil_avatar profil_avatar_${profil['id']}" ><img alt="Selectionner Apports recommandées de ${profil['speudo']}" id="profil_avatar_${profil['id']}_nutrient_${nutrient}" src="img/avatars/${profil['id']}-beige.svg" style="width:20px" >` + Math.round((quantityInPortion / ar * 100) * 100) / 100 + "%</div>";

        }




    }
    var nutrientCheck = nutrient + "Check";
    if (profil[nutrientCheck]) {
        if (document.getElementById(nutrientSpan + '_nutrientPerso')) {
            document.getElementById(nutrientSpan + '_nutrientPerso').innerHTML += `<div class="profil_avatar profil_avatar_${profil['id']}" ><img alt="Alert nutriment ${nutrient} de ${profil['speudo']}" id="profil_avatar_${profil['id']}_nutrient_${nutrient}" src="img/avatars/${profil['id']}-beige.svg" style="width:20px" ></div>`;
            document.getElementById("alertButton").setAttribute('fill', 'red');
            document.getElementById("alertButton").classList.add('alertRed');
            document.getElementById("alertButton_popup").setAttribute('fill', 'red');



        }

    }
    if (profil[nutrientCheck] && profil[nutrient] && document.getElementById(nutrientSpan + 'Value')) {
        if (nutrient == 'FIBTG' || nutrient == 'PRO') {
            if (profil[nutrient] >= document.getElementById(nutrientSpan + 'Value').innerHTML) {
                if (document.getElementById(`profil_avatar_${profil['id']}_nutrient_${nutrient}`)) {
                    try {
                        document.getElementById(`profil_avatar_${profil['id']}_nutrient_${nutrient}`).src = `img/avatars/${profil['id']}-rouge.svg`
                        document.getElementById("profil_avatar_" + profil['id']).setAttribute("src", `img/avatars/${profil['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');
                        document.getElementById(`alert_negatif_nutrient_${profil['id']}`).style.display = "block";
                        document.getElementById(`profil_avatar_negatif_${profil['id']}`).style.display = "block";

                        document.getElementById(`alert_negatif_nutrient_${profil['id']}`).innerHTML += '(pas assez )' + document.getElementById(nutrientSpan + 'Label').innerHTML.replace('dont ', '') + ', ';
                    } catch (error) {
                        console.error(error);
                        // Expected output: ReferenceError: nonExistentFunction is not defined
                        // (Note: the exact output may be browser-dependent)
                    }
                }
            } else {
                try {
                    document.getElementById(`profil_avatar_positif_${profil['id']}`).style.display = "block";
                    document.getElementById(`alert_positif_nutrient_${profil['id']}`).style.display = "block";

                    document.getElementById(`alert_positif_nutrient_${profil['id']}`).innerHTML += '(assez )' + document.getElementById(nutrientSpan + 'Label').innerHTML.replace('dont ', '') + ', ';

                } catch (error) {
                    console.error(error);
                    // Expected output: ReferenceError: nonExistentFunction is not defined
                    // (Note: the exact output may be browser-dependent)
                }
            }
        } else {
            if (profil[nutrient] <= document.getElementById(nutrientSpan + 'Value').innerHTML) {
                if (document.getElementById(`profil_avatar_${profil['id']}_nutrient_${nutrient}`)) {
                    try {
                        document.getElementById(`profil_avatar_${profil['id']}_nutrient_${nutrient}`).src = `img/avatars/${profil['id']}-rouge.svg`
                        document.getElementById("profil_avatar_" + profil['id']).setAttribute("src", `img/avatars/${profil['id']}-rouge.svg`)
                        document.getElementById("alertButton").setAttribute('fill', 'red');
                        document.getElementById("alertButton").classList.add('alertRed');
                        document.getElementById("alertButton_popup").setAttribute('fill', 'red');
                        document.getElementById(`alert_negatif_nutrient_${profil['id']}`).style.display = "block";
                        document.getElementById(`profil_avatar_negatif_${profil['id']}`).style.display = "block";

                        document.getElementById(`alert_negatif_nutrient_${profil['id']}`).innerHTML += '(trop)' + document.getElementById(nutrientSpan + 'Label').innerHTML.replace('dont ', '') + ', ';
                    } catch (error) {
                        console.error(error);
                        // Expected output: ReferenceError: nonExistentFunction is not defined
                        // (Note: the exact output may be browser-dependent)
                    }
                }
            } else {
                try {
                    document.getElementById(`profil_avatar_positif_${profil['id']}`).style.display = "block";
                    document.getElementById(`alert_positif_nutrient_${profil['id']}`).style.display = "block";

                    document.getElementById(`alert_positif_nutrient_${profil['id']}`).innerHTML += '(peu )' + document.getElementById(nutrientSpan + 'Label').innerHTML.replace('dont ', '') + ', ';
                } catch (error) {
                    console.error(error);
                    // Expected output: ReferenceError: nonExistentFunction is not defined
                    // (Note: the exact output may be browser-dependent)
                }
            }
        }


    }

}
function updateNutrifactProfil() {
    if (document.getElementById('energyPerNutrientBasisE14_arPerso')) {
        document.getElementById('energyPerNutrientBasisE14_arPerso').innerHTML = "";
    }
    if (document.getElementById('fatPerNutrientBasis_arPerso')) {
        document.getElementById('fatPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('saturatedFatPerNutrientBasis_arPerso')) {
        document.getElementById('saturatedFatPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('carbohydratesPerNutrientBasis_arPerso')) {
        document.getElementById('carbohydratesPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('saltPerNutrientBasis_arPerso')) {
        document.getElementById('saltPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('proteinPerNutrientBasis_arPerso')) {
        document.getElementById('proteinPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('sugarsPerNutrientBasis_arPerso')) {
        document.getElementById('sugarsPerNutrientBasis_arPerso').innerHTML = "";
    }
    if (document.getElementById('energyPerNutrientBasisE14_nutrientPerso')) {
        document.getElementById('energyPerNutrientBasisE14_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('fatPerNutrientBasis_nutrientPerso')) {
        document.getElementById('fatPerNutrientBasis_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('saturatedFatPerNutrientBasis_nutrientPerso')) {
        document.getElementById('saturatedFatPerNutrientBasis_nutrientPerso').innerHTML = "";
    }

    if (document.getElementById('carbohydratesPerNutrientBasis_nutrientPerso')) {
        document.getElementById('carbohydratesPerNutrientBasis_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('saltPerNutrientBasis_nutrientPerso')) {
        document.getElementById('saltPerNutrientBasis_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('proteinPerNutrientBasis_nutrientPerso')) {
        document.getElementById('proteinPerNutrientBasis_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('fibrePerNutrientBasis_nutrientPerso')) {
        document.getElementById('fibrePerNutrientBasis_nutrientPerso').innerHTML = "";
    }
    if (document.getElementById('sugarsPerNutrientBasis_nutrientPerso')) {
        document.getElementById('sugarsPerNutrientBasis_nutrientPerso').innerHTML = "";
    }


    db.collection('profil').get().then(profils => {

        for (var i = 0; i < profils.length; i++) {
            updateNutrifactElemProfil('ENER', 'energyPerNutrientBasisE14', profils[i]);
            updateNutrifactElemProfil('FAT', 'fatPerNutrientBasis', profils[i]);
            updateNutrifactElemProfil('FASAT', 'saturatedFatPerNutrientBasis', profils[i]);
            updateNutrifactElemProfil('CHOAVL', 'carbohydratesPerNutrientBasis', profils[i]);
            updateNutrifactElemProfil('SALTEQ', 'saltPerNutrientBasis', profils[i]);
            updateNutrifactElemProfil('PRO', 'proteinPerNutrientBasis', profils[i]);
            updateNutrifactElemProfil('SUGAR', 'sugarsPerNutrientBasis', profils[i]);
            //updateNutrifactElemProfil('FIBTG', 'fibrePerNutrientBasis', profils[i]);





        }
    })

}
var jsonProductOFF;
function loadJson() {
    $.ajax({
        url: 'https://www.batra.link/01_new/' + findGetParameter("gtin") + '/' + findGetParameter("gtin") + ".json",
        type: 'GET',
        success: function (jsonLD) {
            console.log("resultat : " + jsonLD);
            populateData(jsonLD)
            loadProfils();
            // Sélectionne le body


            jsonProductGlobal = jsonLD;
            addHistory();
            console.log('/01_new/' + findGetParameter("gtin") + '/recettes.json');
            var xhr = new XMLHttpRequest();

            xhr.open('GET', '/01_new/' + findGetParameter("gtin") + '/recettes.json', true);
            xhr.onload = function () {
                // do something to response
                console.log("recettes : " + this.responseText);
                try {
                    populateRecettes(JSON.parse(this.responseText));
                } catch (error) {
                    console.error(error);
                    // Expected output: ReferenceError: nonExistentFunction is not defined
                    // (Note: the exact output may be browser-dependent)
                }

            };
            xhr.send();

        },
        error: function (data) {

            jsonProductOFF = getJSONFromOFF(findGetParameter("gtin").substr(1, findGetParameter("gtin").length - 1));
            

        }
    });


}
function populateRecettes(jsonRecettes) {
    document.getElementById('product_recettes').classList.remove('noData');
    document.getElementById('product_recettes').classList.remove('asideHidden');
    var recettes = document.getElementById("recettes");
    for (var i = 0; i < jsonRecettes.length; i++) {
        var recette = jsonRecettes[i];
        recettes.innerHTML += `
        <div class="recette">
          <h4>${recette["name"]}</h4>
          <img src="${recette["image"]}" class="imageRecette" alt="${recette["name"]}"><br>
         
          <span class="label">PRÉPARATION : </span><br><span class="data">${recette["prepTime"]}</span><br>
          <span class="label">CUISSON : </span><br><span class="data">${recette["cookTime"]}</span><br>
          <span class="label">Auteur : </span><br><span class="data">${recette["author"]["name"]}</span><br>
          <a href="${recette["url"]}" target="_blank">VOIR</a>
        </div>

    `;
    }
}
function populateOffersElement(jsonObject) {
    document.getElementById('product_offers').classList.remove('noData');
    document.getElementById('product_offers').classList.remove('asideHidden');

    producJson = jsonObject;
    var offers = document.getElementById("Offers");
    html = "";
    var shopOffers = {}

    if (producJson['offer']) {
        var min;
        var max;
        html += `<div class="offerContainer offer_filter" style="width:unset; bottom:unset">`;
        for (var i = 0; i < producJson['offer'].length; i++) {
            var offer = producJson['offer'][i];
            if (!shopOffers[producJson['offer'][i]['offeredBy']['legalName']]) {
                shopOffers[producJson['offer'][i]['offeredBy']['legalName']] = [];
            }
            shopOffers[producJson['offer'][i]['offeredBy']['legalName']].push(offer);

            shopOffers[producJson['offer'][i]['offeredBy']['legalName']].sort(function (a, b) {
                // Convert the date strings to Date objects
                let dateA = new Date(a['datePublished']);
                let dateB = new Date(b['datePublished']);

                // Subtract the dates to get a value that is either negative, positive, or zero
                return dateB - dateA;
            });

        }
        var shopNames = Object.keys(shopOffers);

        for (var j = 0; j < shopNames.length; j++) {
            var offer = shopOffers[shopNames[j]];
            if (!min) {
                min = shopOffers[shopNames[j]]
            } else {
                if (parseFloat(min[0]['offers']["price"]) > parseFloat(shopOffers[shopNames[j]][0]['offers']["price"])) {
                    min = shopOffers[shopNames[j]];
                }
            }
            if (!max) {
                max = shopOffers[shopNames[j]]
            } else {
                if (parseFloat(max[0]['offers']["price"]) < parseFloat(shopOffers[shopNames[j]][0]['offers']["price"])) {
                    max = shopOffers[shopNames[j]];
                }
            }

        }

        offer = min[0];
        html += `
        <span class="offer_filter_item  ${offer['offers']["price"] == min[0]['offers']["price"] ? "minprice" : ""} ${offer['offers']["price"] == max[0]['offers']["price"] ? "maxprice" : ""}">
          <img alt='Revendeur' src='img/logo/${offer['offers']["url"].indexOf('colruyt') > -1 ? "logo_colruyt" : "logo_carrefour"}.png' class="offer_business_img"><br>
          
          <span class="offer_filter_price">${offer['offers']["price"]}<br>
            <span style="font-size: 0.6em;">
              ${offer['offers']["priceCurrency"]}/${producJson['netContent'] ? producJson['netContent']['s:unitCode'].indexOf('L') > -1 ? "l" : "kg" : '??'}
              ${min[1] && min[1]['offers']["price"] ? (min[0]['offers']["price"] - min[1]['offers']["price"]) > 0 ? "<b class='risingPrice'>(+" + (Math.round((min[0]['offers']["price"] - min[1]['offers']["price"]) * 100) / 100) + "€)</b>" : min[1] ? (min[0]['offers']["price"] - min[1]['offers']["price"]) < 0 ? "<b class='lowerPrice'>(" + (Math.round((min[0]['offers']["price"] - min[1]['offers']["price"]) * 100) / 100) + "€)</b>" : "" : "" : ""}
     
            </span>
          </span><br>
          <span class="offer_filter_pourcentage">&nbsp;</span><br>
          <span style="font-size: 0.6em;">${offer['datePublished'].substring(0, 10)}</span>
          
     
        </span>

    `;
        offer = max[0];
        html += `
        <span class="offer_filter_item  ${offer['offers']["price"] == min[0]['offers']["price"] ? "minprice" : ""} ${offer['offers']["price"] == max[0]['offers']["price"] ? "maxprice" : ""}">
          <img alt='Revendeur' src='img/logo/${offer['offers']["url"].indexOf('colruyt') > -1 ? "logo_colruyt" : "logo_carrefour"}.png' class="offer_business_img"><br>
          
          <span class="offer_filter_price">${offer['offers']["price"]}<br>
            <span style="font-size: 0.6em;">
              ${offer['offers']["priceCurrency"]}/${producJson['netContent'] ? producJson['netContent']['s:unitCode'].indexOf('L') > -1 ? "l" : "kg" : '??'}
              ${max[1] && max[1]['offers']["price"] ? (max[0]['offers']["price"] - max[1]['offers']["price"]) > 0 ? "<b class='risingPrice'>(+" + (Math.round((max[0]['offers']["price"] - max[1]['offers']["price"]) * 100) / 100) + "€)</b>" : max[1] ? (max[0]['offers']["price"] - max[1]['offers']["price"]) < 0 ? "<b class='lowerPrice'>(" + (Math.round((max[0]['offers']["price"] - max[1]['offers']["price"]) * 100) / 100) + "€)</b>" : "" : "" : ""}
            </span>
          </span>
            <br>
          <span class="offer_filter_pourcentage">${offer['offers']["price"] == min[0]['offers']["price"] ? "&nbsp;" : "+" + Math.round((((offer['offers']["price"] - min[0]['offers']["price"]) / min[0]['offers']["price"]) * 100) * 100) / 100 + '%'}</span><br>
          <span style="font-size: 0.6em;">${offer['datePublished'].substring(0, 10)}</span>
          
     
        </span>

    `;


        html += `</div>`;
    }
    offers.innerHTML = html;

/*    if (jsonObject['offer']) {


    for (var i = 0; i < jsonObject['offer'].length; i++) {
      var offer = jsonObject['offer'][i];
      offers.innerHTML += `
    
        <div class="recette">
          <img src='img/logo/${offer['offers']["url"].indexOf('colruyt') > -1 ? "logo_colruyt" : "logo_carrefour"}.png' width='100px'>
          <h4>${offer['offers']['itemOffered']['offers']["price"]}${offer['offers']['itemOffered']['offers']["priceCurrency"]}</h4>
          <span class="label">Début de l'offre : </span><br><span class="data">${offer['datePublished'].substring(0,10)}</span><br>
          <a href="${offer['offers']["url"]}" target="_BLANK">VOIR</a>
        </div>

    `;
    }
    // Creating map options
    var mapOptions = {
      center: [51.15, 4.44],
      zoom: 7
    }
    // Creating a map object
    var map = new L.map('my-map', mapOptions);


    // Creating a Layer object
    var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    // Adding layer to the map
    map.addLayer(layer);
  }
*/}
function portionChangeValue(portion) {
    //  document.getElementById("portionPersoSelected").style['font-size'] = (0.4+ portion/100) +"em" ;

    for (var i = 0; i < Object.keys(nutrifactBy100).length; i++) {
        var nutrientId = Object.keys(nutrifactBy100)[i];
        console.log(nutrientId + " : " + nutrifactBy100[nutrientId] + " - " + Math.round(((nutrifactBy100[nutrientId] / 100) * portion) * 100) / 100);
        var dataElement = document.getElementById(nutrientId + "Value");
        dataElement.innerHTML = Math.round(((nutrifactBy100[nutrientId] / 100) * portion) * 100) / 100;
    }

    for (var i = 0; i < Object.keys(nutrifactBy100ArInco).length; i++) {
        var nutrientId = Object.keys(nutrifactBy100ArInco)[i];
        console.log(nutrientId + " : " + nutrifactBy100ArInco[nutrientId] + " - " + Math.round(((nutrifactBy100ArInco[nutrientId] / 100) * portion) * 100) / 100);
        var dataElement = document.getElementById(nutrientId + "_arInco");
        dataElement.innerHTML = Math.round(((nutrifactBy100ArInco[nutrientId] / 100) * portion) * 100) / 100 + "%";
    }
    updateNutrifactProfil();
}
function portionChange(selectElem) {
    if (selectElem.value == -1) {
        selectElem.value = document.getElementById("portionPersoSelected").value;
    }

    console.log(selectElem.value);
    portionChangeValue(selectElem.value);
}
function populateData(jsonProduct) {
    if (jsonProduct['offer']) {
        populateOffersElement(jsonProduct);
    }

    populateRootElement(jsonProduct, 'gtin');
    populateGpcElement(jsonProduct);

    populateLanguageStringElement(jsonProduct, 's:name', 'fr');
    populateLanguageStringElement(jsonProduct, 'functionalName', 'fr');
    populateLanguageStringElement(jsonProduct, 's:description', 'fr');
    populateLanguageStringElement(jsonProduct, 'ingredientStatement', 'fr');


    if (jsonProduct['consumerStorageInstructions']) {
        document.getElementById('product_usages').classList.remove('noData');
        document.getElementById('product_usages').classList.remove('asideHidden');
        populateLanguageStringElement(jsonProduct, 'consumerStorageInstructions', 'fr');
    }
    if (jsonProduct['preparationInformation']) {
        document.getElementById('product_usages').classList.remove('noData');
        document.getElementById('product_usages').classList.remove('asideHidden');
        populateLanguageStringElement(jsonProduct['preparationInformation'], 'preparationInstructions', 'fr');
    }
    if (jsonProduct['consumerUsageInstructions']) {
        document.getElementById('product_usages').classList.remove('noData');
        document.getElementById('product_usages').classList.remove('asideHidden');
        populateLanguageStringElement(jsonProduct, 'consumerUsageInstructions', 'fr');
    }
    if (jsonProduct['productMarketingMessage']) {
        document.getElementById('product_allegations').classList.remove('noData');
        populateLanguageStringElement(jsonProduct, 'productMarketingMessage', 'fr');
    }
    if (jsonProduct['nutritionalClaimStatement']) {
        document.getElementById('product_allegations').classList.remove('noData');
        populateLanguageStringElement(jsonProduct, 'nutritionalClaimStatement', 'fr');
    }
    if (jsonProduct['productFeatureBenefit']) {
        document.getElementById('product_allegations').classList.remove('noData');
        populateLanguageStringElement(jsonProduct, 'productFeatureBenefit', 'fr');
    }
    if (jsonProduct['nutritionalClaimStatement']) {
        document.getElementById('product_allegations').classList.remove('noData');
        document.getElementById('product_allegations').classList.remove('asideHidden');
        populateLanguageStringElement(jsonProduct, 'nutritionalClaimStatement', 'fr');
    }
    if (jsonProduct['countryOfOriginStatement']) {
        document.getElementById('product_origin').classList.remove('asideHidden');
        document.getElementById('product_origin').classList.remove('noData');
        populateLanguageStringElement(jsonProduct, 'countryOfOriginStatement', 'fr');
    }
    if (jsonProduct['awardPrize']) {
        document.getElementById('product_certifications').classList.remove('asideHidden');
        document.getElementById('product_certifications').classList.remove('noData');
        populateAwards(jsonProduct['awardPrize']);
    }
    if (jsonProduct['additionalProductClassification']) {
        populateAdditionalProductClassification(jsonProduct['additionalProductClassification']);
    }

    populateCountryOfOrigin(jsonProduct);

    if (jsonProduct['s:manufacturer']) {
        document.getElementById('product_manufacturer').classList.remove('asideHidden');
        populateLanguageStringElement(jsonProduct['s:manufacturer'], 'name', 'fr');
        if (jsonProduct['s:manufacturer']['s:image']) {
            var nameDiv = document.getElementById('name');
            nameDiv.innerHTML += `<img alt='Fabricant logo' src='${jsonProduct['s:manufacturer']['s:image']['s:url']}' width='50px'>`;
        }
        populateAdresse(jsonProduct['s:manufacturer']);
        populateContactPoint(jsonProduct);

    }

    populateAdditifs(jsonProduct);

    if (jsonProduct['referencedFile']) {
        populateReferencedFiles(jsonProduct);
    }

    populateQuantitativeValueElement(jsonProduct, 'netContent');

    populateNutriFacts(jsonProduct);
    populateVitamines(jsonProduct);
    populateSelsMineraux(jsonProduct);
    populateAllergens(jsonProduct);
    populateLabels(jsonProduct);
    populatePercentageOfAlcoholByVolume(jsonProduct);

    populatePackaging(jsonProduct);
    populateDimensions(jsonProduct);
    populateImageElement(jsonProduct);
}
function populateAdditionalProductClassification(jsonProduct) {



    var elems = jsonProduct;
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem['additionalProductClassificationCode'] == 'NUTRISCORE') {
            var scores_labelsContainer = document.getElementById('scores_labelsContainer');
            scores_labelsContainer.innerHTML += ` <img alt="${elem['additionalProductClassificationValue']}" src="img/score/${elem['additionalProductClassificationValue']}.svg" class="otherProductImage" id="NUTRISCORE" data-value="${elem['additionalProductClassificationValue']}"> `;

        }
        if (elem['additionalProductClassificationCode'] == 'ECOSCORE') {
            var scores_labelsContainer = document.getElementById('scores_labelsContainer');
            scores_labelsContainer.innerHTML += ` <img alt="${elem['additionalProductClassificationValue']}" src="img/score/${elem['additionalProductClassificationValue']}.svg" class="otherProductImage" id="ECOSCORE" data-value="${elem['additionalProductClassificationValue']}"> `;

        }
        if (elem['additionalProductClassificationCode'] == 'NOVA') {
            var scores_labelsContainer = document.getElementById('scores_labelsContainer');
            scores_labelsContainer.innerHTML += ` <img alt="${elem['additionalProductClassificationValue']}" src="img/score/${elem['additionalProductClassificationValue']}.svg" class="otherProductImage" id="NOVA" data-value="${elem['additionalProductClassificationValue']}"> `;

        }


    }


}
function populateReferencedFiles(jsonProduct) {
    if (jsonProduct['referencedFile']) {

        var otherProductImageContainer = document.getElementById('otherProductImageContainer');

        var elems = jsonProduct['referencedFile'];
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            console.log(elem);
            if (elem['referencedFileType'] && elem['referencedFileType']['@id'].indexOf('gs1:ReferencedFileTypeCode-VIDEO') > -1) {
                otherProductImageContainer.innerHTML += ` <img class="otherProductImage" scr="img/video-plus.png"><br><a href="${elem['s:url']['@id']}" class="otherProductImage" target="_BLANK">Le faire soi-même<br></a>`;
            }
            if (elem['referencedFileType'] && elem['referencedFileType']['@id'].indexOf('gs1:ReferencedFileTypeCode-PRODUCT_IMAGE') > -1) {
                if (elem['s:url']['@id'].indexOf('openfoodfacts') > -1) {
                    otherProductImageContainer.innerHTML += `<span class="watermarked"> <img src="${elem['s:url']['@id']}" id="${elem['s:url']['@id']}" class="otherProductImage otherProductImageThumb"> </span>`;

                } else {
                    otherProductImageContainer.innerHTML += ` <img src="${elem['s:url']['@id']}" id="${elem['s:url']['@id']}" class="otherProductImage otherProductImageThumb"> `;
                }
            }
            if (elem['referencedFileType'] && elem['referencedFileType']['@id'].indexOf('gs1:ReferencedFileTypeCode-MARKETING_INFORMATION') > -1) {
                var buyContainer = document.getElementById('buyContainer');

                buyContainer.innerHTML = `<a href="${elem['s:url']['@id']}" target="_BLANK"><img src="img/buy.svg" class="buyImage" alt="">Achète directement au producteur<img src="img/buy.svg" class="buyImage" alt="svg" style="-webkit-transform: scaleX(-1);transform: scaleX(-1);"></a><br><br> `;
            }
        }
        $('.otherProductImageThumb').click(function () {
            document.getElementById('s:image').setAttribute('src', this.getAttribute('src'));
        });
    }

}
function populateAdditifs(jsonProduct) {
    if (jsonProduct['additive']) {

        document.getElementById('product_additifs').classList.remove('noData');

        var additifContainer = document.getElementById('additifsContainer');;
        var additifContainerMini = document.getElementById('additifsContainerMini');;

        var elems = jsonProduct['additive'];
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            console.log(elem);
            if (elem['additiveLevelOfContainment']['@id'].includes('CONTAIN')) {
                color = "#c6cb2e";

                document.getElementById("additifsContainer").innerHTML += `
                    <svg height="60" width="60" class="label_img label_img_BAD" >
                        <circle cx="30" cy="30" r="30" fill="${color}" class="additif_circle_${"E-" + elem['additiveName'][0]['@value'].substring(1)}" />
                        <text x="10" y="38" fill="black" font-size="1em">${elem['additiveName'][0]['@value']}</text>
                    </svg>
                    `;
                document.getElementById("additifsContainerMini").innerHTML += `
                      <svg height="10" width="10" class="label_img label_img_BAD" >
                          <circle cx="5" cy="5" r="5" fill="${color}" class="additif_circle_${"E-" + elem['additiveName'][0]['@value'].substring(1)}" />
                          <text x="0" y="0" fill="black" font-size="0.2em">${elem['additiveName'][0]['@value']}</text>
                      </svg>
                      `;

            }


        }
    }
    var regexAdditif = /E[ ]?[0-9][0-9][0-9][0-9]?[a-z]?[(]?i?i?i?v?i?i?i?/g;
    var additifs = document.getElementById('ingredientStatement').innerHTML.match(regexAdditif);
    console.log(additifs);
    if (additifs) {
        document.getElementById('product_additifs').classList.remove('noData');
        for (var l = 0; l < additifs.length; l++) {
            additifs[l] = additifs[l].replace("(", "");
            additifs[l] = additifs[l].replace(")", "");
            additifs[l] = additifs[l].replace(" ", "");
            var additifsCode = additifs[l];

            color = "#c6cb2e";

            document.getElementById("additifsContainer").innerHTML += `
                    <svg height="60" width="60" class="label_img label_img_BAD" >
                        <circle cx="30" cy="30" r="30" fill="${color}" class="additif_circle_${"E-" + additifsCode.substring(1)}" />
                        <text x="10" y="38" fill="black" font-size="1em">${additifsCode}</text>
                    </svg>
                    `;
            document.getElementById("additifsContainerMini").innerHTML += `
                    <svg height="20" width="20" class="label_img label_img_BAD" >
                        <circle cx="10" cy="10" r="10" fill="${color}" class="additif_circle_${"E-" + additifsCode.substring(1)}" />
                        <text x="0" y="0" fill="black" font-size="0.2em">${additifsCode}</text>
                    </svg>
                    `;


        }

    }


}

function populateAwards(awards) {
    for (var i = 0; i < awards.length; i++) {
        var elem = awards[i];

        populateLanguageStringElement(elem, 'awardPrizeName', 'fr');
        populateLanguageStringElement(elem, 'awardPrizeJury', 'fr');
        populateLanguageStringElement(elem, 'awardPrizeDescription', 'fr');

        var dataElement = document.getElementById("awardPrizeYear");
        if (dataElement) {
            dataElement.innerHTML = elem["awardPrizeYear"]["@value"];
        }

        dataElement = document.getElementById("awardPrizeCountryCode");
        if (dataElement) {
            dataElement.innerHTML = `<img alt="Pays ${elem['awardPrizeCountryCode']['countryCode']}" src="img/country/${elem['awardPrizeCountryCode']['countryCode']}.svg" class="imageCountry" alt="${elem['awardPrizeCountryCode']['countryCode']}">`;

        }
    }
}
function populateRootElement(jsonProduct, elemId) {
    if (jsonProduct[elemId]) {
        var dataElement = document.getElementById(elemId);
        if (dataElement) {
            dataElement.innerHTML = jsonProduct[elemId];
        }
    }
}
function populateGpcElement(jsonProduct) {
    if (jsonProduct['gpcCategoryCode']) {
        var dataElement = document.getElementById('gpcCategoryCode');
        if (dataElement) {
            if (gpcList[jsonProduct['gpcCategoryCode']]) {
                dataElement.innerHTML = gpcList[jsonProduct['gpcCategoryCode']]['brickFR'];
            } else {
                dataElement.innerHTML = jsonProduct['gpcCategoryCode'];

            }

        }
    }
}
function populateImageElement(jsonProduct) {
    if (jsonProduct['s:image']) {

        var dataElement = document.getElementById('s:image');
        if (dataElement) {
            dataElement.src = jsonProduct['s:image']['s:url']['@id'];
            dataElement.setAttribute("alt", "Image de " + document.getElementById("s:name").innerHTML)
        }
        var nbrPortion = 1000
        var dataElement = document.getElementById('imagesNutri');
        dataElement.innerHTML = `<img style="height:${"100px"}" src="${jsonProduct['s:image']['s:url']['@id']}"  id="s:imageNutri">` + dataElement.innerHTML;
        var dataElement = document.getElementById('portionsNutri');
        // dataElement.innerHTML = `${nbrPortion}/${jsonProduct['netContent']['s:value']['@value'] + " = " + (nbrPortion / jsonProduct['netContent']['s:value']['@value'])}`
        dataElement.innerHTML = '100';
        /*
        var portionOptions = document.getElementById('portionPersoSelected').children;
        if (jsonProduct['netContent']['s:unitCode'].indexOf('L') > -1) {
            for (var i = 0; i < portionOptions.length; i++) {
                var portionOption = portionOptions[i];
                portionOption.innerHTML = portionOption.innerHTML.replace("gr", "ml");
            }
            // portionOption.style["font-size"] = (0.4 + portionOption.value / 100) + "em";
        }

        var allProductPortion = jsonProduct['netContent']['s:value']['@value']
        if (jsonProduct['netContent']['s:unitCode'].indexOf('KGM') > -1 || jsonProduct['netContent']['s:unitCode'].indexOf('LTR') > -1) {
            allProductPortion = allProductPortion * 1000;
            //alert(allProductPortion)
        }

        if (!$('#portionPersoSelected option[value="' + allProductPortion + '"]').prop("selected", true).length) {
            //alert('No such option');
            var opt = document.createElement('option');
            opt.value = allProductPortion;
            if (jsonProduct['netContent']['s:unitCode'].indexOf('L') > -1) {
                opt.innerHTML = allProductPortion + "ml";
            } else {
                opt.innerHTML = allProductPortion + "gr";
            }

            document.getElementById('portionPersoSelected').appendChild(opt);
        }
        //document.getElementById('portionPersoSelected').value = allProductPortion
        //portionChangeValue(allProductPortion)
*/
    }
}





function populateQuantitativeValueElement(jsonProduct, elemId) {
    if (jsonProduct[elemId]) {
        if (Array.isArray(jsonProduct[elemId])) {
            var dataElement = document.getElementById(elemId);

            dataElement.innerHTML = "";
            for (var i = 0; i < jsonProduct[elemId].length; i++) {
                var elem = jsonProduct[elemId][i];
                if (dataElement) {
                    dataElement.innerHTML += elem['s:value']['@value'] + "<br>" + elem['s:unitCode'] + "<br>";
                }
            }

        } else {
            var dataElement = document.getElementById(elemId);
            if (dataElement) {
                dataElement.innerHTML = jsonProduct[elemId]['s:value']['@value'] + "<br>" + jsonProduct[elemId]['s:unitCode'];
            }


        }
    }
}

function populateLanguageStringElement(jsonProduct, elemId, language) {
    if (jsonProduct[elemId]) {
        var dataElement = document.getElementById(elemId);
        if (dataElement) {
            dataElement.innerHTML = "Pas de traduction en " + language;
            var elems = jsonProduct[elemId];
            console.log(elems);
            for (var i = 0; i < elems.length; i++) {
                var elem = elems[i];
                console.log(elem);
                if (elem['@language'].includes(language)) {
                    var paragraph = elem['@value'];
                    const regex = /[0-9]{14}?@?[A-Z]{2}?/g;
                    const found = paragraph.match(regex);
                    if (found) {
                        paragraph = paragraph + "<br>"
                        for (var k = 0; k < found.length; k++) {
                            var country = found[k].substr(15, found[k].length);
                            var gtin = found[k].substr(0, 14);
                            paragraph = paragraph.replace(found[k], "<a href='productFull.html?gtin=" + gtin + "'><img alt='Pays " + country + "' class='imageCountry' width='20px' src='img/country/" + country + ".svg' title='" + country + "'></a>")
                            paragraph = paragraph + "<a href='productFull.html?gtin=" + gtin + "'><img class='image_product_ingradients' src='/01_new/" + gtin + "/" + gtin + ".png' title='" + gtin + "'></a>&nbsp;"
                        }

                        console.log(found);
                    }
                    dataElement.innerHTML = paragraph;





                    break;
                }
            }
        }
    }
}
function populateNutrientQuantitativeValueElement(jsonElem, elemId, arIncoValue, unit) {


    var dataElement = document.getElementById(elemId);
    if (dataElement) {

        if (unit) {
            dataElement.innerHTML += "<span class='NutrientQuantitativeValue' id='" + elemId + unit + "Value'>" + jsonElem['s:value']['@value'] + "</span><br><span id='" + elemId + "Unit' class='QuantitativeUnit'>" + jsonElem['s:unitCode'].replace('E14', 'Kcal') + "</span><br>";
            nutrifactBy100[elemId + unit] = jsonElem['s:value']['@value'];
        } else {
            dataElement.innerHTML += "<span class='NutrientQuantitativeValue' id='" + elemId + "Value'>" + jsonElem['s:value']['@value'] + "</span><br><span id='" + elemId + "Unit' class='QuantitativeUnit'>" + jsonElem['s:unitCode'].replace('E14', 'Kcal') + "</span><br>";
            nutrifactBy100[elemId] = jsonElem['s:value']['@value'];
        }

    }
    if (arIncoValue && (!jsonElem['s:unitCode'].includes("KJO"))) {
        dataElement = document.getElementById(elemId + "_arInco");
        if (dataElement) {
            nutrifactBy100ArInco[elemId] = Math.round((jsonElem['s:value']['@value'] / arIncoValue * 100) * 100) / 100;
            dataElement.innerHTML = Math.round((jsonElem['s:value']['@value'] / arIncoValue * 100) * 100) / 100 + "%";
        }
    }

}
function populateNutrientParent(jsonProduct, elemId, label, tableNutriFacts, arIncoValue) {
    var row = tableNutriFacts.insertRow(tableNutriFacts.rows.length);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell2.id = elemId;
    cell2.classList.add("data");
    var cell3 = row.insertCell(2);
    cell3.id = elemId + "_arInco";
    if ("nutriTable" == tableNutriFacts.id) {
        var cell4 = row.insertCell(3);
        cell4.id = elemId + "_arPerso";
    }


    // Add some text to the new cells:
    cell1.innerHTML = "<span class='label' id='" + elemId + "Label'>" + label + "</span><br><span id='" + elemId + "_nutrientPerso" + "'></span>";
    populateNutrientQuantitativeValueElement(jsonProduct[elemId], elemId, arIncoValue);

}
function populateNutrientChild(jsonProduct, elemId, label, tableNutriFacts, arIncoValue) {
    var row = tableNutriFacts.insertRow(tableNutriFacts.rows.length);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    cell1.style = "";
    var cell2 = row.insertCell(1);
    cell2.id = elemId;
    cell2.classList.add("data");
    var cell3 = row.insertCell(2);
    cell3.id = elemId + "_arInco";
    var cell4 = row.insertCell(3);
    cell4.id = elemId + "_arPerso";

    // Add some text to the new cells:
    cell1.innerHTML = "<div style='padding-left: 16px;' class='label' id='" + elemId + "Label'>" + label + " </div> <span id='" + elemId + "_nutrientPerso" + "' style='margin-top: -16px;'></span>";
    populateNutrientQuantitativeValueElement(jsonProduct[elemId], elemId, arIncoValue);

}
let nutrifactBy100 = new Object();
let nutrifactBy100ArInco = new Object();
function populateNutriFacts(jsonProduct) {
    var tableNutriFacts = document.getElementById('nutriTable');
    if (jsonProduct['energyPerNutrientBasis']) {
        var elems = jsonProduct['energyPerNutrientBasis'];
        var row = tableNutriFacts.insertRow(tableNutriFacts.rows.length);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell2.id = "energyPerNutrientBasis";
        cell2.classList.add("data");
        var cell3 = row.insertCell(2);
        cell3.id = "energyPerNutrientBasis_arInco";
        var cell4 = row.insertCell(3);
        cell4.id = "energyPerNutrientBasisE14_arPerso";

        // Add some text to the new cells:
        cell1.innerHTML = "<span class='label' id='energyPerNutrientBasisE14Label'>Énergie</span><br><span id='energyPerNutrientBasisE14_nutrientPerso" + "'></span>";

        if (Array.isArray(elems)) {
            for (var i = 0; i < elems.length; i++) {
                var elem = elems[i];
                populateNutrientQuantitativeValueElement(elem, 'energyPerNutrientBasis', ARInco['energyPerNutrientBasisE14'].split(",")[0], elem['s:unitCode']);
            }
        } else {
            populateNutrientQuantitativeValueElement(elems, 'energyPerNutrientBasis', ARInco['energyPerNutrientBasisE14'].split(",")[0], elems['s:unitCode']);
        }

    }
    if (jsonProduct['fatPerNutrientBasis']) {
        populateNutrientParent(jsonProduct, 'fatPerNutrientBasis', "Graisses", tableNutriFacts, ARInco['fatPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['saturatedFatPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'saturatedFatPerNutrientBasis', "dont acides gras saturés", tableNutriFacts, ARInco['saturatedFatPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['monounsaturatedFatPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'monounsaturatedFatPerNutrientBasis', "dont acides gras mono-insaturés", tableNutriFacts);
    }
    if (jsonProduct['polyunsaturatedFatPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'polyunsaturatedFatPerNutrientBasis', "dont acides gras polyinsaturés", tableNutriFacts);
    }
    if (jsonProduct['carbohydratesPerNutrientBasis']) {
        populateNutrientParent(jsonProduct, 'carbohydratesPerNutrientBasis', "Glucides", tableNutriFacts, ARInco['carbohydratesPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['sugarsPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'sugarsPerNutrientBasis', "dont sucres", tableNutriFacts, ARInco['sugarsPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['polyolsPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'polyolsPerNutrientBasis', "dont polyols", tableNutriFacts);
    }
    if (jsonProduct['starchPerNutrientBasis']) {
        populateNutrientChild(jsonProduct, 'starchPerNutrientBasis', "dont amidon", tableNutriFacts);
    }
    if (jsonProduct['fibrePerNutrientBasis']) {
        populateNutrientParent(jsonProduct, 'fibrePerNutrientBasis', "Fibres", tableNutriFacts);
    }
    if (jsonProduct['proteinPerNutrientBasis']) {
        populateNutrientParent(jsonProduct, 'proteinPerNutrientBasis', "Protéines", tableNutriFacts, ARInco['proteinPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['saltPerNutrientBasis']) {
        populateNutrientParent(jsonProduct, 'saltPerNutrientBasis', "Sel", tableNutriFacts, ARInco['saltPerNutrientBasis'].split(",")[0]);
    }
}
function populateVitamines(jsonProduct) {
    var tableNutriFacts = document.getElementById('vitaminesTable');
    if (jsonProduct['vitaminAPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminAPerNutrientBasis', "Vitamine A", tableNutriFacts, ARInco['vitaminAPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminDPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminDPerNutrientBasis', "Vitamine D", tableNutriFacts, ARInco['vitaminDPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminEPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminEPerNutrientBasis', "Vitamine E", tableNutriFacts, ARInco['vitaminEPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminKPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminKPerNutrientBasis', "Vitamine K", tableNutriFacts, ARInco['vitaminKPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminCPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminCPerNutrientBasis', "Vitamine C", tableNutriFacts, ARInco['vitaminCPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['thiaminPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'thiaminPerNutrientBasis', "Thiamine - Vitamine B1", tableNutriFacts, ARInco['thiaminPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['riboflavinPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'riboflavinPerNutrientBasis', "Riboflavine - Vitamine B2", tableNutriFacts, ARInco['riboflavinPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['niacinPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'niacinPerNutrientBasis', "Niacine - Vitamine B3", tableNutriFacts, ARInco['niacinPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminB6PerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminB6PerNutrientBasis', "Vitamine B6", tableNutriFacts, ARInco['vitaminB6PerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['folicAcidPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'folicAcidPerNutrientBasis', "Acide folique - Vitamine B9", tableNutriFacts, ARInco['folicAcidPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['vitaminB12PerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'vitaminB12PerNutrientBasis', "Vitamine B12", tableNutriFacts, ARInco['vitaminB12PerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['biotinPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'biotinPerNutrientBasis', "Biotine - Vitamine B8", tableNutriFacts, ARInco['biotinPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['pantothenicAcidPerNutrientBasis']) {
        document.getElementById('product_vitamines').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'pantothenicAcidPerNutrientBasis', "Acide pantothénique - Vitamine B5", tableNutriFacts, ARInco['pantothenicAcidPerNutrientBasis'].split(",")[0]);
    }

}
function populateSelsMineraux(jsonProduct) {
    var tableNutriFacts = document.getElementById('selsMinerauxTable');
    if (jsonProduct['potassiumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'potassiumPerNutrientBasis', "Potassium", tableNutriFacts, ARInco['potassiumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['chloridePerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'chloridePerNutrientBasis', "Chlorure", tableNutriFacts, ARInco['chloridePerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['calciumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'calciumPerNutrientBasis', "Calcium", tableNutriFacts, ARInco['calciumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['phosphorusPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'phosphorusPerNutrientBasis', "Phosphore", tableNutriFacts, ARInco['phosphorusPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['magnesiumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'magnesiumPerNutrientBasis', "Magnésium", tableNutriFacts, ARInco['magnesiumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['ironPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'ironPerNutrientBasis', "Fer", tableNutriFacts, ARInco['ironPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['zincPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'zincPerNutrientBasis', "Zinc", tableNutriFacts, ARInco['zincPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['copperPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'copperPerNutrientBasis', "Cuivre", tableNutriFacts, ARInco['copperPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['manganesePerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'manganesePerNutrientBasis', "Manganèse", tableNutriFacts, ARInco['manganesePerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['fluoridePerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'fluoridePerNutrientBasis', "Fluorure", tableNutriFacts, ARInco['fluoridePerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['seleniumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'seleniumPerNutrientBasis', "Sélénium", tableNutriFacts, ARInco['seleniumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['chromiumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'chromiumPerNutrientBasis', "Chrome", tableNutriFacts, ARInco['chromiumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['molybdenumPerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'molybdenumPerNutrientBasis', "Molybdène", tableNutriFacts, ARInco['molybdenumPerNutrientBasis'].split(",")[0]);
    }
    if (jsonProduct['iodinePerNutrientBasis']) {
        document.getElementById('product_selsMineraux').classList.remove('noData');
        populateNutrientParent(jsonProduct, 'iodinePerNutrientBasis', "Iode", tableNutriFacts, ARInco['iodinePerNutrientBasis'].split(",")[0]);
    }
}
function populateAllergens(jsonProduct) {
    if (jsonProduct['hasAllergen']) {
        var profilNotOk = new Object();
        document.getElementById('product_allergens').classList.remove('noData');

        var allergenContainer = document.getElementById('allergenContainer');;
        var allergenContainerMini = document.getElementById('allergenContainerMini');;

        var elems = jsonProduct['hasAllergen'];
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            console.log(elem);
            if (elem['allergenLevelOfContainmentCode']['@id'].includes('CONTAIN')) {
                allergenContainer.innerHTML += `<img alt="Allergène ${elem['allergenType']['@id']}" src="img/allergen/${elem['allergenType']['@id']}.svg"  class="imageAllergen  ${elem['allergenType']['@id']}"/>`;
                allergenContainerMini.innerHTML += `<img alt="Allergène ${elem['allergenType']['@id']}" src="img/allergen/${elem['allergenType']['@id']}.svg" class="imageAllergenMini  ${elem['allergenType']['@id']}"/>`;

            }
        }


    }




}

function populateLabels(jsonProduct) {
    if (jsonProduct['packagingMarkedLabelAccreditation']) {

        var labelContainer = document.getElementById('scores_labelsContainer');

        var elems = jsonProduct['packagingMarkedLabelAccreditation'];
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            console.log(elem);
            console.log(elem['@id'].split('-'));
            if (elem['@id'].split('-').length > 1) {
                labelContainer.innerHTML += `<img alt="Label ${elem['@id']}" src="img/label/${elem['@id'].split('-')[1]}.jpg" class="imageLabel">`;

            } else {
                labelContainer.innerHTML += `<img alt="Label ${elem['@id']}" src="img/label/${elem['@id']}.jpg" class="imageLabel">`;

            }

        }
    }

}
function populateCountryOfOrigin(jsonProduct) {
    if (jsonProduct['countryOfOrigin']) {
        document.getElementById('product_usages').classList.remove('asideHidden');
        var countryOfOrigin = document.getElementById('countryOfOrigin');

        var elems = jsonProduct['countryOfOrigin'];
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            console.log(elem);
            countryOfOrigin.innerHTML += `<img alt="Pays ${elem['countryCode']}" src="img/country/${elem['countryCode']}.svg" class="imageCountry" alt="${elem['countryCode']}">`;


        }
    }

}
function populateAdresse(jsonProduct) {
    if (jsonProduct['address']) {

        var address = document.getElementById('address');

        var elems = jsonProduct['address']['streetAddress'];


        address.innerHTML += `${jsonProduct['address']['streetAddress'][0]['@value']}<br>${jsonProduct['address']['postalCode']}-${jsonProduct['address']['addressLocality'][0]['@value']}<br><img alt="Pays ${jsonProduct['address']['addressCountry']}" src="img/country/${jsonProduct['address']['addressCountry']}.svg" class="imageCountry" alt="${jsonProduct['address']['addressCountry']}"><br>`;



    }

}
function populateContactPoint(jsonProduct) {
    if (jsonProduct['s:manufacturer']) {

        var contactPoint = document.getElementById('contactPoint');



        contactPoint.innerHTML += `${jsonProduct['s:manufacturer']['telephone'] ? "Tel : " + jsonProduct['s:manufacturer']['telephone'] : ''}${jsonProduct['s:manufacturer']['faxNumber'] ? '<br>Fax : ' + jsonProduct['s:manufacturer']['faxNumber'] : ''}${jsonProduct['s:manufacturer']['email'] ? '<br>Email : ' + jsonProduct['s:manufacturer']['email'] : ''}${jsonProduct['s:manufacturer']['url'] ? "<br>Web : <a href='https:" + jsonProduct['s:manufacturer']['url'] + "'>" + jsonProduct['s:manufacturer']['url'] + '</a><br>' : ''}`;



    }

}
function populatePercentageOfAlcoholByVolume(jsonProduct) {
    if (jsonProduct['percentageOfAlcoholByVolume']) {

        var percentageOfAlcoholByVolume = document.getElementById('percentageOfAlcoholByVolume');


        percentageOfAlcoholByVolume.innerHTML = ` ${jsonProduct['percentageOfAlcoholByVolume']['@value']}%`;



    }

}
function populateDimensions(jsonProduct) {
    if (jsonProduct['inPackageHeight']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');
        var inPackageHeight = document.getElementById('inPackageHeight');
        inPackageHeight.innerHTML = ` ${jsonProduct['inPackageHeight']['s:value']['@value']} ${jsonProduct['inPackageHeight']['s:unitCode']}`;
    }
    if (jsonProduct['inPackageWidth']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var inPackageWidth = document.getElementById('inPackageWidth');
        inPackageWidth.innerHTML = ` ${jsonProduct['inPackageWidth']['s:value']['@value']} ${jsonProduct['inPackageWidth']['s:unitCode']}`;
    }
    if (jsonProduct['inPackageDepth']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var inPackageDepth = document.getElementById('inPackageDepth');
        inPackageDepth.innerHTML = ` ${jsonProduct['inPackageDepth']['s:value']['@value']} ${jsonProduct['inPackageDepth']['s:unitCode']}`;
    }
    if (jsonProduct['inPackageDiameter']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var inPackageDiameter = document.getElementById('inPackageDiameter');
        inPackageDiameter.innerHTML = ` ${jsonProduct['inPackageDiameter']['s:value']['@value']} ${jsonProduct['inPackageDiameter']['s:unitCode']}`;
    }
    if (jsonProduct['outOfPackageHeight']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var outOfPackageHeight = document.getElementById('outOfPackageHeight');
        outOfPackageHeight.innerHTML = ` ${jsonProduct['outOfPackageHeight']['s:value']['@value']} ${jsonProduct['outOfPackageHeight']['s:unitCode']}`;
    }
    if (jsonProduct['outOfPackageWidth']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var inPackageWidth = document.getElementById('outOfPackageWidth');
        outOfPackageWidth.innerHTML = ` ${jsonProduct['outOfPackageWidth']['s:value']['@value']} ${jsonProduct['outOfPackageWidth']['s:unitCode']}`;
    }
    if (jsonProduct['outOfPackageDepth']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var outOfPackageDepth = document.getElementById('outOfPackageDepth');
        outOfPackageDepth.innerHTML = ` ${jsonProduct['outOfPackageDepth']['s:value']['@value']} ${jsonProduct['outOfPackageDepth']['s:unitCode']}`;
    }
    if (jsonProduct['outOfPackageDiameter']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var outOfPackageDiameter = document.getElementById('outOfPackageDiameter');
        outOfPackageDiameter.innerHTML = ` ${jsonProduct['outOfPackageDiameter']['s:value']['@value']} ${jsonProduct['outOfPackageDiameter']['s:unitCode']}`;
    }

}
function populatePackaging(jsonProduct) {
    if (jsonProduct['packaging']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        if (jsonProduct['packaging']['packagingType']) {
            var packagingType = document.getElementById('packagingType');
            packagingType.innerHTML = ` ${jsonProduct['packaging']['packagingType']}`;

        }
        if (jsonProduct['packaging']['packagingRecyclingProcessType']) {
            var packagingRecyclingProcessType = document.getElementById('packagingRecyclingProcessType');
            packagingRecyclingProcessType.innerHTML = '';
            var elems = jsonProduct['packaging']['packagingRecyclingProcessType'];
            for (var i = 0; i < elems.length; i++) {
                var elem = elems[i];

                packagingRecyclingProcessType.innerHTML += ` ${elem['@id']}`;


            }

        }
    }
    if (jsonProduct['packagingMaterial']) {
        document.getElementById('product_emballage').classList.remove('noData');
        document.getElementById('product_emballage').classList.remove('asideHidden');

        var elems = jsonProduct['packagingMaterial'];
        var packagingMaterialType = document.getElementById('packagingMaterialType');
        packagingMaterialType.innerHTML = '';
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];

            packagingMaterialType.innerHTML += `${elem['packagingMaterialType']['@id']} : ${elem['packagingMaterialCompositionQuantity']['s:value']['@value']} ${elem['packagingMaterialCompositionQuantity']['s:unitCode']}<br>`;


        }
    }
}
function closeModalFunction() {
    var modalContainer = document.getElementById("modalContainer");
    modalContainer.style.display = "none";
    window.location.href = "history.html";
}



function addFavoris() {
    db.collection('app_favory').get().then(products => {
        var existingFavoris = false;
        if (products.length > 0) {

            for (let i = products.length - 1; i > -1; i--) {
                if (products[i]["jsonData"]['gtin'] == jsonProductGlobal['gtin']) {
                    existingFavoris = true;
                    break;
                }

            }
        }
        if (!existingFavoris) {
            db.collection('app_favory').add({
                id: jsonProductGlobal['gtin'],
                jsonData: jsonProductGlobal

            }, jsonProductGlobal['gtin']);
            const favorisButton = $('#favorisButton');


            // ✅ works
            favorisButton.attr("fill", "green");
        } else {
            db.collection('app_favory').doc({ id: jsonProductGlobal['gtin'] }).delete()

        }


    });

}

function addHistory() {
    db.collection('app_history').add({
        id: jsonProductGlobal['gtin'],
        jsonData: jsonProductGlobal

    }, jsonProductGlobal['gtin']);
    db.collection('app_favory').get().then(products => {
        var existingFavoris = false;
        if (products.length > 0) {

            for (let i = products.length - 1; i > -1; i--) {
                if (products[i]["jsonData"]['gtin'] == jsonProductGlobal['gtin']) {
                    const favorisButton = $('#favorisButton');


                    // ✅ works
                    favorisButton.attr("fill", "green");
                    break;
                }

            }
        }



    });



}
$("#popupGeminiButton").on('click', function (event) {
    $("#popupGemini_content").show();
    $("#popupGemini").show();
    //document.getElementById('submit-button').click();
});
$("#button_close_popupGemini").on('click', function (event) {
    $("#popupGemini_content").hide();
    $("#popupGemini").hide();
});

$("#button_close_popup").on('click', function (event) {
    $("#popup_content").hide();
    $("#popup").hide();
});
$("#alertButton").on('click', function (event) {
    $("#popup_content").show();
    $("#popup").show();
});
$("#favorisButton").on('click', function (event) {
    addFavoris();
    if ("grey" == this.getAttribute("fill")) {
        this.setAttribute("fill", "green");
        localStorage
    } else {
        this.setAttribute("fill", "grey");
    }
});
function greatImage(elem) {


    elem.classList.add("greatImage")
    setTimeout(function () {
        elem.classList.remove("greatImage");
    }, 5000);


}

async function convertTiff(url) {
    $.get("convertTiff.php?url=" + url + "&gtin=" + gtin, function (data) {
        noImage = false;
        document.getElementById("s:image").src = "tiff/" + gtin + ".png";
    });
}
function showOfferMap() {
    document.getElementById('popupDialogMap').show();
}




$("a[href='#top']").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});
var portionPersoSelected = document.getElementById('portionPersoSelected');
portionPersoSelected.addEventListener('change', async (event) => {
    portionChange(event.target);
});
var canTranslate;
var translation;
var translator;
async function translate(text) {
    var languagePair = {
        sourceLanguage: "fr", // Or detect the source language with the Language Detection API
        targetLanguage: 'en',
    };
    console.log("detected language : " + "fr");
    canTranslate = await translation.canTranslate(languagePair);
    console.log(`can translate fr->en : ${canTranslate}`);
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
    console.log("en : " + text)
    console.log(resultTranslate)
    document.getElementById('prompt-input').innerHTML += resultTranslate;
    popupGeminiImage.classList.remove("popupGeminiButton_unselected");
    popupGeminiImage.classList.add("bumpingImage");
    document.getElementById('submit-button').click();
}



const popupGeminiButton = document.getElementById("popupGeminiButton");
const popupGeminiImage = document.getElementById("popupGeminiImage");

// Action lorsque la souris survole l'image
popupGeminiButton.addEventListener("mouseover", () => {
    $("#popupGemini_content").show();
    $("#popupGemini").show();
});

// Action lorsque la souris quitte l'image
popupGeminiButton.addEventListener("mouseout", () => {
    $("#popupGemini_content").hide();
    $("#popupGemini").hide();
});
// État de la lecture
let isPlaying = false;
$("#popupGeminiButton").on('click', function (event) {
    if (isPlaying) {
        // Si la lecture est en cours, mettre en pause
        window.speechSynthesis.pause();
        isPlaying = false;
    } else {
        // Si la lecture est en pause ou non démarrée
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            // Si en pause, reprendre
            window.speechSynthesis.resume();
        } 
        isPlaying = true;
    }
    //document.getElementById('submit-button').click();
});
$("#button_close_popupGemini").on('click', function (event) {

});