
let db = new Localbase('db');

function activateMenuItem() {
	document.getElementById("nav-link_rechercher").classList.add("nav-link_actif");
	document.getElementById("nav-link_mobile_rechercher").classList.add("nav-link_actif");
}

$(document).ready(function () {

	loadCategories(0);


});
function loadCategories(startIndex) {
	var categories_container = document.getElementById("categories_container");
	categories_container.innerHTML = "";
	for (var i = startIndex; i < categories.length; i++) {
		console.log(categories[i]);
		//	for (var i = startIndex; ((i<startIndex+50)||(i < categories.length)); i++) {
		printCardCategory(categories[i]["gcpCode"], categories[i], categories_container);
		console.log(categories[i]["gcpCode"] +" : " + categories[i]);
	}
	document.getElementById("loadingPanel").style.display = "none";


}

function cleRelachee(evt) {
	var filtre = document.getElementById('filtre').value;
	filtre = filtre.toUpperCase();
	var elements = document.getElementsByClassName("category_card");
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
function printCardCategory(key, objet, container) {
	try {
		console.log("GPCCodes : " +GPCCodes);
		container.innerHTML += `<div class="category_card " style="position: relative">
        <a href="categorie.html?GPC=${key}&page=0&nbrPage=${objet['cptPages']}"><table width="100%">
            <tr>
                <td colspan="2" style="height: 34px;">
					<h4>${GPCCodes[key]["fr"]}</h4>
	              </td>
            </tr>
            <tr><td colspan="5"><hr></td></tr>
			<tr>
			<td>
				${objet['cptProducts']} références
			</td>
		</tr>
            <tr>
                <td>
					<img src="img/gpc/${key}.jpg" style="width:auto;height:auto; max-height:150px;max-width:250px">
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
	var allProduct_card = document.getElementsByClassName("category_card");
	for (var i = 0; i < allProduct_card.length; i++) {
		allProduct_card[i].onclick = function () {
			document.getElementById("loadingPanel").style.display = "block";
		};
	}


}