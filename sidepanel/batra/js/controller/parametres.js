

function activateMenuItem() {
    document.getElementById("nav-link_parametres").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_parametres").classList.add("nav-link_actif");
}
$(document).ready(function () {

    document.getElementById("loadingPanel").style.display = "none";
 
});
let db = new Localbase('db');
