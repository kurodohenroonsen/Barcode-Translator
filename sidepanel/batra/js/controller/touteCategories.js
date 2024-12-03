
let db = new Localbase('db');

function activateMenuItem() {
	document.getElementById("nav-link_historique").classList.add("nav-link_actif");
	document.getElementById("nav-link_mobile_historique").classList.add("nav-link_actif");
}

$(document).ready(function () {

	loadCategories(0);


});
function loadCategories(startIndex) {
	var categories_container = document.getElementById("categories_container");
	categories_container.innerHTML = "";
	for (var i = startIndex; i < categories.length; i++) {
		//	for (var i = startIndex; ((i<startIndex+50)||(i < categories.length)); i++) {
		printCardCategory(categories[i], categories_container);
		console.log(categories[i]);
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
function printCardCategory(objet, container) {
	try {
		console.log("GPCCodes : " +GPCCodes);
		container.innerHTML += `<div class="category_card " style="position: relative">
        <table width="100%">
            <tr>
                <td colspan="2" style="height: 34px;">
					<h4>${GPCCodes[objet['gpcCategoryCode']]["fr"]}</h4>
					${objet['gpcCategoryCode']}
	              </td>
            </tr>
            <tr><td colspan="5"><hr></td></tr>
			<tr>
			<td>
				${objet['count(*)']} références
			</td>
		</tr>
            <tr>
                <td>
					<img src="img/gpc/${objet['gpcCategoryCode']}.jpg" style="width:auto;height:auto; max-height:150px;max-width:250px">
                </td>
            </tr>

        
        </table>
        
        
    </div>`;
	} catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	}
	var allProduct_card = document.getElementsByClassName("category_card");



}