
let allergensStored = new Array();
function loadAllergens() {
    var allergenTypeCodesObject = new Object();
    for (var i = 0; i < allergenTypeCodes.length; i++) {
        allergenTypeCodesObject[allergenTypeCodes[i]['@id']] = allergenTypeCodes[i];
    }
    var allergensCodes = Object.keys(allergenTypeCodesObject);
    var allergensContainerElem = document.getElementById("allergensContainer");
    for (var i = 0; i < allergensCodes.length; i++) {
        console.log(allergensCodes[i]);
        console.log(allergenTypeCodesObject[allergensCodes[i]]);
        if (allergensStored && allergensStored.includes(allergensCodes[i])) {
            allergensContainerElem.innerHTML += `<img id="${allergensCodes[i]}" data-value="${allergensCodes[i]}" class="imageAllergen" src="img/allergen/${allergenTypeCodesObject[allergensCodes[i]]['gs1:originalCodeValue']}.svg" 
    title="${allergenTypeCodesObject[allergensCodes[i]]['rdfs:label']['@value'] + '- ' + allergenTypeCodesObject[allergensCodes[i]]['rdfs:comment']['@value']}" 
    alt="${allergenTypeCodesObject[allergensCodes[i]]['rdfs:label']['@value']}">`
        } else {
            allergensContainerElem.innerHTML += `<img id="${allergensCodes[i]}" data-value="${allergensCodes[i]}" class="imageAllergen greyImg" src="img/allergen/${allergenTypeCodesObject[allergensCodes[i]]['gs1:originalCodeValue']}.svg" 
    title="${allergenTypeCodesObject[allergensCodes[i]]['rdfs:label']['@value'] + '- ' + allergenTypeCodesObject[allergensCodes[i]]['rdfs:comment']['@value']}" 
    alt="${allergenTypeCodesObject[allergensCodes[i]]['rdfs:label']['@value']}">`
        }

    }
    jQuery(".imageAllergen").click(function () {
        if (this.classList.contains("greyImg")) {
            this.classList.remove("greyImg")
            allergensStored.push(this.id);
            saveValue();
        } else {
            this.classList.add("greyImg");
            allergensStoredIndex = allergensStored.indexOf(this.id);
            if (allergensStoredIndex > -1) {
                allergensStored.splice(allergensStoredIndex, 1);
            }
            saveValue();

        }

    });

}
let db = new Localbase('db_batra_link');
loadProfil(findGetParameter("profilId"));


function filterAllergens() {
    var filterText = document.getElementById("allergenFilter").value.toLowerCase();
    var images = document.getElementsByClassName("imageAllergen");
    for (var i = 0; i < images.length; i++) {
        var title = images[i].getAttribute("title").toLowerCase();
        if (title.indexOf(filterText) > -1) {
            images[i].style.display = "block";

        } else {

            images[i].style.display = "none";
        }
    }
}

function saveValue() {

    db.collection('profil').doc({ id: findGetParameter("profilId") }).update({
        allergens: allergensStored

    })

}

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


function loadProfil(profilId) {
    db.collection('profil').doc({ id: profilId }).get().then(profil => {
        $("#profil_name").html(profil["speudo"]);
        document.getElementById("avatar_img").src = "img/avatars/" + profilId + "-beige.svg";
        console.log(profil);
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", links[i].getAttribute("href") + "?profilId=" + findGetParameter("profilId"));
        }
        allergensStored = profil["allergens"];
        loadAllergens();
    })

}
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

var allergenFilter = document.getElementById('allergenFilter');
allergenFilter.addEventListener('keyup', async (event) => {
    filterAllergens();
});
var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
    const element = moreInfos[index];
    element.addEventListener('click', async (event) => {
        showDetails(event.target);
    });

}