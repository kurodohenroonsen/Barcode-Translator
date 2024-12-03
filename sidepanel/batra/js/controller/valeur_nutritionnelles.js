let db = new Localbase('db');

async function toggleNutrient(checkbox, code) {
    if (checkbox.checked) {
        var value_code = document.getElementById(code + "Value");
        saveValue(code, value_code.value);

    } else {
        await db.collection('nutrient').doc({ code: code }).delete();
    }

}

async function saveValue(code, value) {
    await db.collection('nutrient').get().then(historique => {
        db.collection('nutrient').add({
            code: code,
            value: document.getElementById(code).value
        }, code);
    });
}
async function saveValueVNRPerso(code, valuePerso) {
    await db.collection('VNRPerso').get().then(VNRPerso => {
        db.collection('VNRPerso').add({
            code: code,
            value: valuePerso
        }, code);
    });
}

async function saveProfile(selectElem) {
    await db.collection('Profile').get().then(Profile => {
        db.collection('Profile').add({
            code: selectElem.id,
            value: selectElem.value
        }, selectElem.id);
    });
}
async function saveProfileCheck(selectElem) {
    await db.collection('Profile').get().then(Profile => {
        db.collection('Profile').add({
            code: selectElem.id,
            value: selectElem.checked
        }, selectElem.id);
    });
}
async function saveProfilePregnant(selectElem) {
    var pregnant = "pregnant_3";
    if (document.getElementById("pregnant_1").checked) {
        pregnant = "pregnant_1";
    } else if (document.getElementById("pregnant_2").checked) {
        pregnant = "pregnant_2";
    }
    await db.collection('Profile').get().then(Profile => {
        db.collection('Profile').add({
            code: "pregnant",
            value: pregnant
        }, "pregnant");
    });
}
async function ChargeAlertNutrient() {
    await db.collection('nutrient').orderBy('code').get().then(nutrient => {

        for (var i = 0; i < nutrient.length; i++) {
            var code = nutrient[i].code;
            var checkBox_code = document.getElementById(code + "Check");
            checkBox_code.checked = true;
            var value_code = document.getElementById(code + "Value");
            value_code.innerHTML = nutrient[i].value;
            var slider_code = document.getElementById(code);
            slider_code.value = nutrient[i].value;
            var value = (slider_code.value - slider_code.min) / (slider_code.max - slider_code.min) * 100
            slider_code.style.background = 'linear-gradient(to right, #c6cb2e 0%, #c6cb2e ' + value + '%, #fff ' + value + '%, white 100%)'

        }

    })
}
async function chargeProfile() {
    await db.collection('Profile').orderBy('code').get().then(Profile => {

        for (var i = 0; i < Profile.length; i++) {
            var code = Profile[i].code;
            var value = Profile[i].value;
            if (code == "pregnantCheck") {
                document.getElementById(code).checked = value;
                if (value) {
                    document.getElementById("pregnantDiv").style.display = "block";
                }
            } else if (code == "milkCheck") {
                document.getElementById(code).checked = value;
            } else if (code == "pregnant") {
                document.getElementById(value).checked = true;
            } else {
                document.getElementById(code).value = value;
            }



        }
        document.getElementById("loadingPanel").style.display = "none";

        computeProfile();

    })
}

function addListenerToRange(code) {
    let i = document.getElementById(code);
    let o = document.getElementById(code + "Value");

    o.innerHTML = i.value;

    document.getElementById(code).oninput = function() {
        var value = (this.value - this.min) / (this.max - this.min) * 100
        this.style.background = 'linear-gradient(to right, #c6cb2e 0%, #c6cb2e ' + value + '%, #fff ' + value + '%, white 100%)'
    };

    // use 'change' instead to see the difference in response
    i.addEventListener('input', function() {

        o.innerHTML = i.value;
        var checkBox_code = document.getElementById(code + "Check");
        checkBox_code.checked = true;
        saveValue(code, i.value);
    }, false);


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


    var hommeAgekcal = { 0: 31, 3: 504, 10: 657, 18: 679, 30: 879, 60: 700, 75: 820 };
    var femmeAgekcal = { 0: 31, 3: 485, 10: 693, 18: 496, 30: 829, 60: 688, 75: 624 };
    var hommeAgecoef = { 0: 60, 3: 23, 10: 13, 18: 15.3, 30: 11.6, 60: 11.9, 75: 8.4 };
    var femmeAgecoef = { 0: 58, 3: 20, 10: 13, 18: 14.7, 30: 8.7, 60: 9.2, 75: 9.8 };
    var hommeActivtycoef = { 'activityLight': 1.55, 'activityMedium': 1.78, 'activityHeavy': 2.1 };
    var femmeActivtycoef = { 'activityLight': 1.56, 'activityMedium': 1.64, 'activityHeavy': 1.82 };
    var BMR = 0;
    var BMRActivity = 0;
    var kcalJour = 0;

    if ("homme" == document.getElementById("sex").value) {
        if (document.getElementById("age").value == 0) {
            BMR = hommeAgecoef[document.getElementById("age").value] * poidsIdeal - hommeAgekcal[document.getElementById("age").value];
        } else {
            BMR = hommeAgecoef[document.getElementById("age").value] * poidsIdeal + hommeAgekcal[document.getElementById("age").value];
        }

    } else {
        if (document.getElementById("age").value == 0) {
            BMR = femmeAgecoef[document.getElementById("age").value] * poidsIdeal - femmeAgekcal[document.getElementById("age").value];
        } else {
            BMR = femmeAgecoef[document.getElementById("age").value] * poidsIdeal + femmeAgekcal[document.getElementById("age").value];
        }
    }
    if ("homme" == document.getElementById("sex").value) {
        if (document.getElementById("age").value == 0) {
            BMRActivity = (hommeAgecoef[document.getElementById("age").value] * poidsIdeal - hommeAgekcal[document.getElementById("age").value]) * hommeActivtycoef[document.getElementById("activity").value];;
        } else {
            BMRActivity = (hommeAgecoef[document.getElementById("age").value] * poidsIdeal + hommeAgekcal[document.getElementById("age").value]) * hommeActivtycoef[document.getElementById("activity").value];;
        }

    } else {
        if (document.getElementById("age").value == 0) {
            BMRActivity = (femmeAgecoef[document.getElementById("age").value] * poidsIdeal - femmeAgekcal[document.getElementById("age").value]) * femmeActivtycoef[document.getElementById("activity").value];;
        } else {
            BMRActivity = (femmeAgecoef[document.getElementById("age").value] * poidsIdeal + femmeAgekcal[document.getElementById("age").value]) * femmeActivtycoef[document.getElementById("activity").value];;
        }
    }
    if ("homme" == document.getElementById("sex").value) {
        if (document.getElementById("age").value == 0) {
            kcalJour = (hommeAgecoef[document.getElementById("age").value] * (poidsIdeal / 0.239) - (hommeAgekcal[document.getElementById("age").value] / 0.239)) * hommeActivtycoef[document.getElementById("activity")];
        } else {
            kcalJour = (hommeAgecoef[document.getElementById("age").value] * (poidsIdeal / 0.239) + (hommeAgekcal[document.getElementById("age").value] / 0.239)) * hommeActivtycoef[document.getElementById("activity")];
        }
    } else {
        if (document.getElementById("age").value == 0) {
            kcalJour = (femmeAgecoef[document.getElementById("age").value] * (poidsIdeal / 0.239) - femmeAgekcal[document.getElementById("age").value] / 0.239) * femmeActivtycoef[document.getElementById("activity")];
        } else {
            kcalJour = (femmeAgecoef[document.getElementById("age").value] * (poidsIdeal / 0.239) + femmeAgekcal[document.getElementById("age").value] / 0.239) * femmeActivtycoef[document.getElementById("activity")];
        }
    }
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
    saveValueVNRPerso("ENER-", Math.round(BMRActivity));
    document.getElementById("FATBest").innerHTML = Math.round(BMRActivity / 9 / 100 * 30);
    saveValueVNRPerso("FAT", Math.round(BMRActivity / 9 / 100 * 30));
    document.getElementById("FASATBest").innerHTML = Math.round(BMRActivity / 9 / 10);
    saveValueVNRPerso("FASAT", Math.round(BMRActivity / 9 / 10));

    document.getElementById("PRO-Best").innerHTML = Math.round(BMRActivity / 4 / 10);
    document.getElementById("SUGAR-Best").innerHTML = Math.round(BMRActivity / 4 / 10);
    document.getElementById("STARCHBest").innerHTML = Math.round(BMRActivity / 4 / 100 * 55) - Math.round(BMRActivity / 4 / 10);
    saveValueVNRPerso("PRO-", Math.round(BMRActivity / 4 / 10));
    document.getElementById("CHOAVLBest").innerHTML = Math.round(BMRActivity / 4 / 100 * 55) + ' à ' + Math.round(BMRActivity / 4 / 100 * 75);
    saveValueVNRPerso("CHOAVL", Math.round(BMRActivity / 4 / 100 * 55));
    saveValueVNRPerso("SUGAR-", 90);
    saveValueVNRPerso("SALTEQ", 6);
    saveValueVNRPerso("NACL", 6);

}

function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}

$(document).ready(function() {
    ChargeAlertNutrient();
    addListenerToRange('ENER-');
    addListenerToRange('FAT');
    addListenerToRange('FASAT');
    addListenerToRange('CHOAVL');
    addListenerToRange('SUGAR-');
    addListenerToRange('PRO-');
    addListenerToRange('SALTEQ');
    chargeProfile();
    computeProfile();
    document.getElementById("loadingPanel").style.display = "none";
});

function showHidePregnantDiv(divID) {
    var pregnantCheck = document.getElementById("pregnantCheck");

    var pregnantDiv = document.getElementById("pregnantDiv");
    if (pregnantCheck.checked) {
        pregnantDiv.style.display = 'block';
    } else {
        pregnantDiv.style.display = 'none';
    }
}