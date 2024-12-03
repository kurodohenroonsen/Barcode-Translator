let db = new Localbase('db');


function addRemoveCountry(countryId){
	if("none" == document.getElementById('country_container_unselected'+countryId).style.display){
        db.collection('country').doc({ code: countryId }).delete();
        document.getElementById('country_container_unselected'+countryId).style.display = "block";
	}else{
        db.collection('country').get().then(historique => {
            db.collection('country').add({
                code : countryId
            },countryId);
        });
        document.getElementById('country_container_unselected'+countryId).style.display = "none";
	}
}

async function ChargeAlertCountry(){
    await db.collection('country').orderBy('code').get().then(country => {
    
    for(var i=0;i<country.length;i++){
        var code = country[i].code;
        document.getElementById('country_container_unselected'+code).style.display = "none";
    }
    
    document.getElementById("loadingPanel").style.display = "none";
})
}


function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}

function printCountrys(){
    var countrys_container = document.getElementById("countrys_container")
    var keys = Object.keys(CountryCodes);
    for(var i=0;i<keys.length;i++){
        var key = keys[i];
        countrys_container.innerHTML += `					
        <div text="${CountryCodes[key]['fr']} - ${CountryCodes[key]['alpha2']} - ${CountryCodes[key]['alpha3']} - ${key}"
            class="parametres_country_container" id="country_container_${key}"
            onclick="addRemoveCountry('${key}');">
            <div class="parametres_country_icon_unselected" id="country_container_unselected${key}">
                &nbsp;
            </div>
            <img alt="${CountryCodes[key]['fr']}"
                class="parametres_country_icon" id="country_img_${key}" src="img/country/${key}.svg">
        </div>`
     }
}
function cleRelachee(evt) {
    var filtre = document.getElementById('filtre').value;
    filtre = filtre.toUpperCase();
    var elements = document.getElementsByClassName("parametres_country_container");
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

$( document ).ready(function() {
    printCountrys();
    ChargeAlertCountry();

});