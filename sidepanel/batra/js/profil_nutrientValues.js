
function addListenerToRange(code) {
    let i = document.getElementById(code);
    let o = document.getElementById(code + "Value");

    o.innerHTML = i.value;

    document.getElementById(code).oninput = function () {
        var value = (this.value - this.min) / (this.max - this.min) * 100
        if (code == 'FIBTG' || code == 'PRO') {
            this.style.background = 'linear-gradient(to right, red 0%, red ' + value + '%, #c6cb2e ' + value + '%, #75ae3a 100%)'

        } else {
            this.style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, red ' + value + '%, red 100%)'

        }
        //
    };

    // use 'change' instead to see the difference in response
    i.addEventListener('input', function () {

        o.innerHTML = i.value;
        var checkBox_code = document.getElementById(code + "Check");
        checkBox_code.checked = true;
        saveValue(code, i.value);
    }, false);


}
function saveValue(code, value) {
    var profilId = findGetParameter("profilId")
    if ("ENER" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            ENER: value,
            ENERCheck: true
        })
    }
    if ("FAT" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FAT: value,
            FATCheck: true
        })
    }
    if ("FASAT" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FASAT: value,
            FASATCheck: true
        })
    }
    if ("CHOAVL" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            CHOAVL: value,
            CHOAVLCheck: true
        })
    }
    if ("SUGAR" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            SUGAR: value,
            SUGARCheck: true
        })
    }
    if ("PRO" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            PRO: value,
            PROCheck: true
        })
    }
    if ("SALTEQ" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            SALTEQ: value,
            SALTEQCheck: true
        })
    }
    if ("FIBTG" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FIBTG: value,
            FIBTGCheck: true
        })
    }

}
$(document).ready(function () {
    addListenerToRange('ENER');
    addListenerToRange('FAT');
    addListenerToRange('FASAT');
    addListenerToRange('CHOAVL');
    addListenerToRange('SUGAR');
    addListenerToRange('PRO');
    addListenerToRange('FIBTG');
    addListenerToRange('SALTEQ');
    loadProfil();
});


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
    var profilId = findGetParameter("profilId");
    await db.collection('profil').doc({ id: profilId }).get().then(profil => {
        $("#profil_name").html(profil["speudo"]);
        document.getElementById("avatar_img").src = "img/avatars/" + profilId + "-beige.svg";
        console.log(profil);
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", links[i].getAttribute("href") + "?profilId=" + findGetParameter("profilId"));
        }
        loadNutrient(profil, "ENER");
        loadNutrient(profil, "FAT");
        loadNutrient(profil, "FASAT");
        loadNutrient(profil, "CHOAVL");
        loadNutrient(profil, "SUGAR");
        loadNutrient(profil, "PRO");
        loadNutrient(profil, "SALTEQ");
        loadNutrient(profil, "FIBTG");

    })

}
function loadNutrient(profil, nutrientID) {
    if (profil[nutrientID] && profil[nutrientID + "Check"]) {

        document.getElementById(nutrientID + "Value").innerHTML = profil[nutrientID];
        document.getElementById(nutrientID + "Check").checked = profil[nutrientID + "Check"];
        document.getElementById(nutrientID).value = profil[nutrientID];
        value = (document.getElementById(nutrientID).value - document.getElementById(nutrientID).min) / (document.getElementById(nutrientID).max - document.getElementById(nutrientID).min) * 100
        if (nutrientID == 'FIBTG' || nutrientID == 'PRO') {
            document.getElementById(nutrientID).style.background = 'linear-gradient(to right, red 0%, red ' + value + '%, #c6cb2e ' + value + '%, #75ae3a 100%)'

        } else {
            document.getElementById(nutrientID).style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, red ' + value + '%, red 100%)'

        }
    }
}
function toggleNutrient(elem, code) {
    var profilId = findGetParameter("profilId")

    if ("ENER" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            ENERCheck: elem.checked
        })
    }
    if ("FAT" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FATCheck: elem.checked
        })
    }
    if ("FASAT" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FASATCheck: elem.checked
        })
    }
    if ("CHOAVL" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            CHOAVLCheck: elem.checked
        })
    }
    if ("SUGAR" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            SUGARCheck: elem.checked
        })
    }
    if ("PRO" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            PROCheck: elem.checked
        })
    }
    if ("SALTEQ" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            SALTEQCheck: elem.checked
        })
    }
    if ("FIBTG" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            FIBTGCheck: elem.checked
        })
    }
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
