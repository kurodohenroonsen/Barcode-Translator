
function addListenerToRange(code) {
    let i = document.getElementById(code);


    document.getElementById(code).oninput = function () {
        var value = (this.value - this.min) / (this.max - this.min) * 100
        this.style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, #fff ' + value + '%, white 100%)'

        elem = document.getElementById(code + 'Img');

        elem.src = "img/score/" + code + "_" + this.value + ".svg";

        var profilId = findGetParameter("profilId")
        if ("NUTRISCORE" == code) {
            db.collection('profil').doc({ id: profilId }).update({
                NUTRISCORE: this.value,
                NUTRISCORECheck: true

            })
        }
        if ("SIGA" == code) {
            db.collection('profil').doc({ id: profilId }).update({
                SIGA: this.value,
                SIGACheck: true
            })
        }
        if ("NOVA" == code) {
            db.collection('profil').doc({ id: profilId }).update({
                NOVA: this.value,
                NOVACheck: true

            })
            elem.src = "img/score/" + code + "_" + (parseInt(this.value) + 1) + ".svg";
        }
        if ("ECOSCORE" == code) {
            db.collection('profil').doc({ id: profilId }).update({
                ECOSCORE: this.value,
                ECOSCORECheck: true

            })
        }
    };

    // use 'change' instead to see the difference in response
    i.addEventListener('input', function () {


        var checkBox_code = document.getElementById(code + "Check");
        checkBox_code.checked = true;

    }, false);


}
function addRemoveScore(elem, code) {
    var profilId = findGetParameter("profilId")
    if ("NUTRISCORE" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            NUTRISCORECheck: elem.checked

        })
    }
    if ("SIGA" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            SIGACheck: elem.checked

        })
    }
    if ("NOVA" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            NOVACheck: elem.checked

        })
    }
    if ("ECOSCORE" == code) {
        db.collection('profil').doc({ id: profilId }).update({
            ECOSCORECheck: elem.checked

        })
    }
}
$(document).ready(function () {
    addListenerToRange('NUTRISCORE');
    addListenerToRange('SIGA');
    addListenerToRange('ECOSCORE');
    addListenerToRange('NOVA');
    loadProfil(findGetParameter("profilId"));
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
    await db.collection('profil').doc({ id: profilId }).get().then(profil => {
        $("#profil_name").html(profil["speudo"]);
        document.getElementById("avatar_img").src = "img/avatars/" + profilId + "-beige.svg";
        console.log(profil);
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", links[i].getAttribute("href") + "?profilId=" + findGetParameter("profilId"));
        }
        if (profil["NUTRISCORE"] && profil["NUTRISCORECheck"]) {
            document.getElementById("NUTRISCORECheck").checked = profil["NUTRISCORECheck"];
            elem = document.getElementById("NUTRISCORE" + 'Img');
            elem.src = "img/score/" + "NUTRISCORE" + "_" + profil["NUTRISCORE"] + ".svg";
            document.getElementById("NUTRISCORE").value = profil["NUTRISCORE"];
            value = (document.getElementById("NUTRISCORE").value - document.getElementById("NUTRISCORE").min) / (document.getElementById("NUTRISCORE").max - document.getElementById("NUTRISCORE").min) * 100
            document.getElementById("NUTRISCORE").style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, #fff ' + value + '%, white 100%)'
        }
        if (profil["SIGA"] && profil["SIGACheck"]) {
            document.getElementById("SIGACheck").checked = profil["SIGACheck"];
            elem = document.getElementById("SIGA" + 'Img');
            elem.src = "img/score/" + "SIGA" + "_" + profil["SIGA"] + ".svg";
            document.getElementById("SIGA").value = profil["SIGA"];
            value = (document.getElementById("SIGA").value - document.getElementById("SIGA").min) / (document.getElementById("SIGA").max - document.getElementById("SIGA").min) * 100
            document.getElementById("SIGA").style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, #fff ' + value + '%, white 100%)'
        }
        if (profil["ECOSCORE"] && profil["ECOSCORECheck"]) {
            document.getElementById("ECOSCORECheck").checked = profil["ECOSCORECheck"];
            elem = document.getElementById("ECOSCORE" + 'Img');
            elem.src = "img/score/" + "ECOSCORE" + "_" + profil["ECOSCORE"] + ".svg";
            document.getElementById("ECOSCORE").value = profil["ECOSCORE"];
            value = (document.getElementById("ECOSCORE").value - document.getElementById("ECOSCORE").min) / (document.getElementById("ECOSCORE").max - document.getElementById("ECOSCORE").min) * 100
            document.getElementById("ECOSCORE").style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, #fff ' + value + '%, white 100%)'
        }
        if (profil["NOVA"] && profil["NOVACheck"]) {
            document.getElementById("NOVACheck").checked = profil["NOVACheck"];
            elem = document.getElementById("NOVA" + 'Img');
            elem.src = "img/score/" + "NOVA" + "_" + profil["NOVA"] + ".svg"; ``
            document.getElementById("NOVA").value = profil["NOVA"];
            value = (document.getElementById("NOVA").value - document.getElementById("NOVA").min) / (document.getElementById("NOVA").max - document.getElementById("NOVA").min) * 100
            document.getElementById("NOVA").style.background = 'linear-gradient(to right, #c6cb2e 0%, #75ae3a ' + value + '%, #fff ' + value + '%, white 100%)'
        }
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

var addRemoveScoreNOVAs = document.getElementsByClassName('addRemoveScoreNOVA');
for (let index = 0; index < addRemoveScoreNOVAs.length; index++) {
    const element = addRemoveScoreNOVAs[index];
    element.addEventListener('change', async (event) => {
        addRemoveScore(this,"NOVA")
    });

}
var addRemoveScoreNOVAs = document.getElementsByClassName('addRemoveScoreNOVA');
for (let index = 0; index < addRemoveScoreNOVAs.length; index++) {
    const element = addRemoveScoreNOVAs[index];
    element.addEventListener('change', async (event) => {
        addRemoveScore(this,"NOVA")
    });

}
var addRemoveScoreECOSCOREs = document.getElementsByClassName('addRemoveScoreECOSCORE');
for (let index = 0; index < addRemoveScoreECOSCOREs.length; index++) {
    const element = addRemoveScoreECOSCOREs[index];
    element.addEventListener('change', async (event) => {
        addRemoveScore(this,"ECOSCORE")
    });

}
var addRemoveScoreSIGAs = document.getElementsByClassName('addRemoveScoreSIGA');
for (let index = 0; index < addRemoveScoreSIGAs.length; index++) {
    const element = addRemoveScoreSIGAs[index];
    element.addEventListener('change', async (event) => {
        addRemoveScore(this,"SIGA")
    });

}
var addRemoveScoreSIGAs = document.getElementsByClassName('addRemoveScoreNUTRISCORE');
for (let index = 0; index < addRemoveScoreSIGAs.length; index++) {
    const element = addRemoveScoreSIGAs[index];
    element.addEventListener('change', async (event) => {
        addRemoveScore(this,"NUTRISCORE")
    });

}
var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
  const element = moreInfos[index];
  element.addEventListener('click', async (event) => {
      showDetails(event.target);
  });
  
}