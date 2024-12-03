
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
        console.log(profil)
        $("#profil_name").html(profil["speudo"]);
        document.getElementById("avatar_img").src = "img/avatars/" + profilId + "-beige.svg";
        console.log(profil);
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("href", links[i].getAttribute("href") + "?profilId=" + findGetParameter("profilId"));
        }

    })

}
loadProfil(findGetParameter("profilId"))

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