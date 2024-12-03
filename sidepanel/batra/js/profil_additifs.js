
function selectAll(category) {
    var additifsCodes = Object.keys(AllAdditifs);
    for (var i = 0; i < additifsCodes.length; i++) {
        var additif = AllAdditifs[additifsCodes[i]];
        if (category === additif['category'] || category === "ALL") {
            const index = allergensStored.indexOf(additifsCodes[i]);
            if (index == -1) {
                allergensStored.push(additifsCodes[i]);
            }

        }
    }
    saveValue();
    location.reload();
}
function deselectAll(category) {
    allergensStored = new Array();
    saveValue();
    location.reload();
}
var allergensStored;
function loadAllergens() {
    var additifsCodes = Object.keys(AllAdditifs);
    var list = document.getElementById('additifsList');

    for (var i = 0; i < additifsCodes.length; i++) {


        var option = document.createElement('option');
        option.value = additifsCodes[i] + " : " + AllAdditifs[additifsCodes[i]]['name'];
        list.appendChild(option);

        console.log(AllAdditifs[additifsCodes[i]]['category'] + "Container");
        var allergensContainerElem = document.getElementById(AllAdditifs[additifsCodes[i]]['category'] + "Container");

        if (allergensStored.includes(additifsCodes[i])) {

            var allergensContainerElem = document.getElementById("ALLContainer");
            allergensContainerElem.innerHTML += `<svg alt="${additifsCodes[i] + " : " + AllAdditifs[additifsCodes[i]]['name']}" title="${additifsCodes[i] + " : " + AllAdditifs[additifsCodes[i]]['name']}" id="${additifsCodes[i] + "_ALL"}" height="60" width="60" class="additif ${AdditifGroups[additifsCodes[i]]} ${AllAdditifs[additifsCodes[i]]['category']}" >
                    <circle cx="30" cy="30" r="30" fill="#c6cb2e"></circle><text x="10" y="38" fill="black" font-size="0.9em">${additifsCodes[i]}</text>
                </svg>`
        } else {

            var allergensContainerElem = document.getElementById("ALLContainer");
            allergensContainerElem.innerHTML += `<svg alt="${additifsCodes[i] + " : " + AllAdditifs[additifsCodes[i]]['name']}" title="${additifsCodes[i] + " : " + AllAdditifs[additifsCodes[i]]['name']}" id="${additifsCodes[i] + "_ALL"}" height="60" width="60" class="additif greyAdditif ${AdditifGroups[additifsCodes[i]]} ${AllAdditifs[additifsCodes[i]]['category']}" >
                    <circle cx="30" cy="30" r="30" fill="#c6cb2e"></circle><text x="10" y="38" fill="black" font-size="0.9em">${additifsCodes[i]}</text>
                </svg>`
        }


    }
    jQuery(".additif").click(function () {
        if (this.classList.contains("greyAdditif")) {
            this.classList.remove("greyAdditif")
            allergensStored.push(this.id.split("_")[0]);
            saveValue();
        } else {
            this.classList.add("greyAdditif");
            const index = allergensStored.indexOf(this.id.split("_")[0]);
            allergensStored = allergensStored.splice(index, 1);
            saveValue();

        }

    });

}
jQuery(".categorySelect").change(function () {
    var selectedCategory = this.value;
    if (selectedCategory === "ALL") {
        jQuery(".additif").css("display", "grid");

    } else if (selectedCategory === "GROUPE_ALL") {
        jQuery(".additif").css("display", "grid");

    } else {
        jQuery(".additif").css("display", "none");
        jQuery("." + this.value).css("display", "grid");
    }


});
jQuery(".radioChoice").click(function () {
    jQuery(".categorySelect").value = "ALL";
    var choice = this.value;
    jQuery(".categorySelect").attr("disabled", true);
    document.getElementById(choice).disabled = false;

});
let db = new Localbase('db_batra_link');
loadProfil(findGetParameter("profilId"));


function filterAllergens() {
    var filterText = document.getElementById("allergenFilter").value.toLowerCase();
    var images = document.getElementsByClassName("additif");
    for (var i = 0; i < images.length; i++) {
        var title = images[i].getAttribute("alt").toLowerCase();
        if (title.indexOf(filterText) > -1) {
            images[i].style.display = "block";

        } else {

            images[i].style.display = "none";
        }
    }
}

function saveValue() {

    db.collection('profil').doc({ id: findGetParameter("profilId") }).update({
        additifs: allergensStored

    });


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
        allergensStored = profil["additifs"];
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

var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
  const element = moreInfos[index];
  element.addEventListener('click', async (event) => {
      showDetails(event.target);
  });
  
}
var allergenFilter = document.getElementById('allergenFilter');
allergenFilter.addEventListener('keyup', async (event) => {
    filterAllergens();
});

var selectAlls = document.getElementsByClassName('selectAll');
for (let index = 0; index < selectAlls.length; index++) {
  const element = selectAlls[index];
  element.addEventListener('click', async (event) => {
    selectAlls(element.getAttribute('data'));
  });
  
}
var deselectAlls = document.getElementsByClassName('deselectAll');
for (let index = 0; index < deselectAlls.length; index++) {
  const element = deselectAlls[index];
  element.addEventListener('click', async (event) => {
    deselectAlls(element.getAttribute('data'));
  });
  
}
