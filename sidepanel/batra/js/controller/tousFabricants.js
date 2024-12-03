
let db = new Localbase('db');

function activateMenuItem() {
	document.getElementById("nav-link_rechercher").classList.add("nav-link_actif");
	document.getElementById("nav-link_mobile_rechercher").classList.add("nav-link_actif");
}

$(document).ready(function () {

	loadFabricants(0);


});
function loadFabricants(startIndex) {
	var fabricants_container = document.getElementById("fabricants_container");
	fabricants_container.innerHTML = "";
	for (var i = startIndex; i < Object.keys(fabricants).length; i++) {
		//	for (var i = startIndex; ((i<startIndex+50)||(i < fabricants.length)); i++) {
		printCardFabricant(Object.keys(fabricants)[i], fabricants[Object.keys(fabricants)[i]], fabricants_container);
		console.log(Object.keys(fabricants)[i]);
	}
	document.getElementById("loadingPanel").style.display = "none";


}

function cleRelachee(evt) {
	var filtre = document.getElementById('filtre').value;
	filtre = filtre.toUpperCase();
	var elements = document.getElementsByClassName("fabricant_card");
	if (filtre.length > 1) {
		for (i = 0; i < elements.length; i++) {
			if (!elements[i].innerHTML.toUpperCase().includes(filtre)) {
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
function printCardFabricant(gln, objet, container) {
	try {
		console.log("fabricant : " +objet);
		container.innerHTML += `<div class="fabricant_card " style="position: relative">
		<a href="fabricant.html?GLN=${gln}&page=0&nbrPage=${objet['cptPages']}"><table width="100%">
 
        <table width="100%">
            <tr>
                <td colspan="2" style="height: 34px;">
					<h4>${gln}</h4>
	              </td>
            </tr>
            <tr><td colspan="5"><hr></td></tr>
			<tr>
			<td>
				${objet['cptProducts']} références
			</td>
		</tr>


        
        </table>
        </a>
        
    </div>`;
	} catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	}
	var allProduct_card = document.getElementsByClassName("fabricant_card");



}