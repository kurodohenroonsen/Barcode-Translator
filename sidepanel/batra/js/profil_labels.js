
let labelsStored = new Array();
function loadlabels() {
    var labelTypeCodesObject = new Object();
    var labelsContainerElem = document.getElementById("labelsContainer");
    for (var i = labels.length - 1; i >= 0; i--) {

        if (labelsStored && labelsStored.includes(labels[i][0])) {
            labelsContainerElem.innerHTML += `<img id="${labels[i][0]}" data-value="${labels[i][0]}" class="imageAllergen" src="img/label/${labels[i][0]}.jpg" 
    title="${labels[i][0]}" 
    alt="${labels[i][0]}">`
        } else {
            labelsContainerElem.innerHTML += `<img id="${labels[i][0]}" data-value="${labels[i][0]}" class="imageAllergen greyImg" src="img/label/${labels[i][0]}.jpg" 
      title="${labels[i][0]}" 
    alt="${labels[i][0]}">`
        }

    }
    jQuery(".imageAllergen").click(function () {
        if (this.classList.contains("greyImg")) {
            this.classList.remove("greyImg")
            labelsStored.push(this.id);
            saveValue();
        } else {
            this.classList.add("greyImg");
            labelsStored.remove(this.id);
            saveValue();

        }

    });

}
let db = new Localbase('db_batra_link');
loadProfil(findGetParameter("profilId"));


function filterlabels() {
    var filterText = document.getElementById("labelFilter").value.toLowerCase();
    var images = document.getElementsByClassName("imagelabel");
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
        labels: labelsStored

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
        if (profil["labels"]) {
            labelsStored = profil["labels"];
        } else {
            labelsStored = [];
        }

        loadlabels();
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