
function showHidePregnantDiv(divID) {
    var pregnantCheck = document.getElementById("pregnantCheck");

    var pregnantDiv = document.getElementById("pregnantDiv");
    if (pregnantCheck.checked) {
        pregnantDiv.style.display = 'block';
    } else {
        pregnantDiv.style.display = 'none';
    }
}
function computeProfile() {


    var poidsIdeal;
    var poidsIdeal2;
    if ("homme" == document.getElementById("sex").value) {
        poidsIdeal = 20 * (document.getElementById("taille").value / 100);
        poidsIdeal = Math.round(poidsIdeal * (document.getElementById("taille").value / 100));
        poidsIdeal2 = 25 * (document.getElementById("taille").value / 100);
        poidsIdeal2 = Math.round(poidsIdeal2 * (document.getElementById("taille").value / 100));

    } else {
        poidsIdeal = 18 * (document.getElementById("taille").value / 100);
        poidsIdeal = Math.round(poidsIdeal * (document.getElementById("taille").value / 100));
        poidsIdeal2 = 24 * (document.getElementById("taille").value / 100);
        poidsIdeal2 = Math.round(poidsIdeal2 * (document.getElementById("taille").value / 100));
    }


    var hommeAgekcal = {
        0: 31,
        1: 550,
        2: 727,
        3: 830,
        4: 888,
        5: 942,
        6: 996,
        7: 1059,
        8: 1126,
        9: 1191,
        10: 1196,
        11: 1264,
        12: 1345,
        13: 1444,
        14: 1555,
        15: 1670,
        16: 1761,
        17: 1819,
        18: 1674,
        30: 1621,
        40: 1574,
        50: 1496,
        60: 1416,
        70: 1320
    };

    var femmeAgekcal = {
        0: 31,
        1: 503,
        2: 669,
        3: 775,
        4: 826,
        5: 877,
        6: 928,
        7: 984,
        8: 1045,
        9: 1107,
        10: 1125,
        11: 1181,
        12: 1240,
        13: 1299,
        14: 1346,
        15: 1379,
        16: 1398,
        17: 1409,
        18: 1342,
        30: 1278,
        40: 1224,
        50: 1154,
        60: 1102,
        70: 1027
    };

    var hommeAgecoef = { 0: 60, 3: 23, 10: 13, 18: 15.3, 30: 11.6, 60: 11.9, 75: 8.4 };
    var femmeAgecoef = { 0: 58, 3: 20, 10: 13, 18: 14.7, 30: 8.7, 60: 9.2, 75: 9.8 };

    var humainActivtycoef = {
        'sedentaire': 1.4,
        'modéré': 1.6,
        'actif': 1.8,
        'trèsActif': 2.0,
        'extremementActif': 2.2
    };


    var BMR = 0;
    var BMRActivity = 0;
    var kcalJour = 0;


    if ("homme" == document.getElementById("sex").value) {
        if (document.getElementById("age").value == 0
            || document.getElementById("age").value == 1
            || document.getElementById("age").value == 2
        ) {
            BMR = 28.2 * poidsIdeal + 859 * document.getElementById("taille").value / 100 - 371
        } else if (document.getElementById("age").value == 3
            || document.getElementById("age").value == 4
            || document.getElementById("age").value == 5
            || document.getElementById("age").value == 6
            || document.getElementById("age").value == 7
            || document.getElementById("age").value == 8
            || document.getElementById("age").value == 9
        ) {
            BMR = 15.1 * poidsIdeal + 313 * document.getElementById("taille").value / 100 + 306
        } else if (document.getElementById("age").value == 10
            || document.getElementById("age").value == 11
            || document.getElementById("age").value == 12
            || document.getElementById("age").value == 13
            || document.getElementById("age").value == 14
            || document.getElementById("age").value == 15
            || document.getElementById("age").value == 16
            || document.getElementById("age").value == 17
        ) {
            BMR = 15.6 * poidsIdeal + 266 * document.getElementById("taille").value / 100 + 299
        } else if (document.getElementById("age").value == 18) {
            BMR = 14.4 * poidsIdeal + 313 * document.getElementById("taille").value / 100 + 113
        } else if (document.getElementById("age").value == 30
            || document.getElementById("age").value == 40
            || document.getElementById("age").value == 59) {
            BMR = 11.4 * poidsIdeal + 541 * document.getElementById("taille").value / 100 - 137
        } else {
            BMR = 11.4 * poidsIdeal + 541 * document.getElementById("taille").value / 100 - 256
        }

    } else {
        if (document.getElementById("age").value == 0
            || document.getElementById("age").value == 1
            || document.getElementById("age").value == 2
        ) {
            BMR = 30.4 * poidsIdeal + 703 * document.getElementById("taille").value / 100 - 287
        } else if (document.getElementById("age").value == 3
            || document.getElementById("age").value == 4
            || document.getElementById("age").value == 5
            || document.getElementById("age").value == 6
            || document.getElementById("age").value == 7
            || document.getElementById("age").value == 8
            || document.getElementById("age").value == 9
        ) {
            BMR = 15.9 * poidsIdeal + 210 * document.getElementById("taille").value / 100 + 349
        } else if (document.getElementById("age").value == 10
            || document.getElementById("age").value == 11
            || document.getElementById("age").value == 12
            || document.getElementById("age").value == 13
            || document.getElementById("age").value == 14
            || document.getElementById("age").value == 15
            || document.getElementById("age").value == 16
            || document.getElementById("age").value == 17
        ) {
            BMR = 9.4 * poidsIdeal + 249 * document.getElementById("taille").value / 100 + 462
        } else if (document.getElementById("age").value == 18) {
            BMR = 10.4 * poidsIdeal + 615 * document.getElementById("taille").value / 100 - 282
        } else if (document.getElementById("age").value == 30
            || document.getElementById("age").value == 40
            || document.getElementById("age").value == 59) {
            BMR = 8.18 * poidsIdeal + 502 * document.getElementById("taille").value / 100 - 11, 6
        } else {
            BMR = 8.52 * poidsIdeal + 421 * document.getElementById("taille").value / 100 - 256
        }
    }

    BMRActivity = BMR * humainActivtycoef[document.getElementById("activity").value]


    //alert(BMR);
    var commentsBMI;
    var BMI = Math.round(document.getElementById("poids").value / ((document.getElementById("taille").value / 100 * document.getElementById("taille").value / 100)) * 10) / 10;
    if (BMI <= 18.5) {
        commentsBMI = "Maigre";
    } else {
        if (BMI <= 25) {
            commentsBMI = "Normal";
        } else {
            if (BMI <= 30) {
                commentsBMI = "Surpoids";
            } else {
                if (BMI <= 35) {
                    commentsBMI = "Obésité modérée";
                } else {
                    if (BMI <= 40) {
                        commentsBMI = "Obésité sévère";
                    } else {
                        if (BMI > 35) {
                            commentsBMI = "Obésité morbide";
                        } else {

                        }

                    }

                }

            }

        }

    }
    if (document.getElementById("pregnantCheck").checked) {
        if (document.getElementById("pregnant_1").checked) {
            BMRActivity = BMRActivity + 70;
        } else if (document.getElementById("pregnant_2").checked) {
            BMRActivity = BMRActivity + 260;
        } else {
            BMRActivity = BMRActivity + 500;
        }
    }
    if (document.getElementById("milkCheck").checked) {
        BMRActivity = BMRActivity + 500;
    }
    document.getElementById("bmi").innerHTML = BMI;
    document.getElementById("bmiComments").innerHTML = commentsBMI;
    document.getElementById("poidsIdeal").innerHTML = poidsIdeal;
    document.getElementById("poidsIdeal2").innerHTML = poidsIdeal2;
    document.getElementById("bmr").innerHTML = Math.round(BMR);
    document.getElementById("ENER-Best").innerHTML = Math.round(BMRActivity);

    document.getElementById("FATBest").innerHTML = Math.round(BMRActivity / 9 / 100 * 35);

    document.getElementById("FASATBest").innerHTML = Math.round(BMRActivity / 9 / 10);


    document.getElementById("PRO-Best").innerHTML = Math.round(BMRActivity / 4 / 100 * 15);
    document.getElementById("SUGAR-Best").innerHTML = Math.round(BMRActivity / 4 / 10);
    document.getElementById("STARCHBest").innerHTML = Math.round(BMRActivity / 4 / 100 * 55) - Math.round(BMRActivity / 4 / 10);

    document.getElementById("CHOAVLBest_high").innerHTML = Math.round(BMRActivity / 4 / 100 * 50);
    var profilId = findGetParameter("profilId")
    db.collection('profil').doc({ id: profilId }).update({
        sex: document.getElementById("sex").value,
        age: document.getElementById("age").value,
        poids: document.getElementById("poids").value,
        taille: document.getElementById("taille").value,
        activity: document.getElementById("activity").value,

        energyPerNutrientBasisE14_persoAR: document.getElementById("ENER-Best").innerHTML,
        fatPerNutrientBasis_persoAR: document.getElementById("FATBest").innerHTML,
        saturatedFatPerNutrientBasis_persoAR: document.getElementById("FASATBest").innerHTML,
        proteinPerNutrientBasis_persoAR: document.getElementById("PRO-Best").innerHTML,
        sugarsPerNutrientBasis_persoAR: document.getElementById("SUGAR-Best").innerHTML,
        carbohydratesPerNutrientBasis_persoAR: document.getElementById("CHOAVLBest_high").innerHTML,
        saltPerNutrientBasis_persoAR: 5,

        pregnantCheck: document.getElementById("pregnantCheck").checked,
        milkCheck: document.getElementById("milkCheck").checked
    })
}

function changeSex(select) {
    if ("femme" == select.value) {
        document.getElementById("isFemelle").style.display = 'block';
    } else {
        document.getElementById("isFemelle").style.display = 'none';
        document.getElementById("pregnantCheck").checked = false;
        document.getElementById("milkCheck").checked = false;
        computeProfile();
    }

}


let db = new Localbase('db_batra_link');
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

async function loadProfil(profilId) {
    await db.collection('profil').doc({ id: profilId }).get().then(profil => {
        $("#profil_name").html(profil["speudo"]);
        document.getElementById("avatar_img").src = "img/avatars/" + profilId + "-beige.svg";
        console.log(profil);
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", links[i].getAttribute("href") + "?profilId=" + findGetParameter("profilId"));
        }
        if (profil["sex"]) {
            document.getElementById("sex").value = profil["sex"];
            if (profil["sex"] == "femme") {
                document.getElementById("isFemelle").style.display = 'block';
            }
            document.getElementById("age").value = profil["age"];
            document.getElementById("poids").value = profil["poids"];
            document.getElementById("taille").value = profil["taille"];
            document.getElementById("activity").value = profil["activity"];
            document.getElementById("pregnantCheck").checked = profil["pregnantCheck"];
            document.getElementById("milkCheck").checked = profil["milkCheck"];
            if (profil["pregnantCheck"]) {
                document.getElementById("pregnantDiv").style.display = 'block';
            }
        }

        computeProfile();
    })

}
loadProfil(findGetParameter("profilId"))
function showDetails(markElem) {
    if (markElem.parentElement.children[0].style.display == "none") {
        markElem.parentElement.children[0].style.display = "block";
    } else {
        markElem.parentElement.children[0].style.display = "none";
    }
}

$("a[href='#top']").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});
var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
    const element = moreInfos[index];
    element.addEventListener('click', async (event) => {
        showDetails(event.target);
    });

}
var showHidePregnantDivs = document.getElementsByClassName('showHidePregnantDiv');
for (let index = 0; index < moreInfos.length; index++) {
    const element = showHidePregnantDivs[index];
    element.addEventListener('click', async (event) => {
        showHidePregnantDivs();
    });

}

var computeProfiles = document.getElementsByClassName('computeProfile');
for (let index = 0; index < computeProfiles.length; index++) {
    const element = computeProfiles[index];
    element.addEventListener('change', async (event) => {
        computeProfile();
    });

}

var changeSexs = document.getElementsByClassName('changeSex');
for (let index = 0; index < moreInfos.length; index++) {
    const element = changeSexs[index];
    element.addEventListener('change', async (event) => {
        changeSex(event.target);
    });

}
