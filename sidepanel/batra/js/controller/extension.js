
let db = new Localbase('db');


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
function activateMenuItem() {
	document.getElementById("nav-link_rechercher").classList.add("nav-link_actif");
	document.getElementById("nav-link_mobile_rechercher").classList.add("nav-link_actif");
}


$(document).ready(function () {
	document.getElementById("loadingPanel").style.display = "none";
	console.log(findGetParameter("GTINs"));
	var GTINs = findGetParameter("GTINs").split(',');
	var container = document.getElementById("products_container");
	for(var i=0; i< GTINs.length;i++){
		$.ajax({
			url: '01/' + GTINs[i] + '/' + GTINs[i] + '.json',
			type: 'GET',
			success: function (jsonLD) {
				console.log(jsonLD);
				printCardProduct(jsonLD, container);
				document.getElementById("nbrProducts").innerHTML = parseInt(document.getElementById("nbrProducts").innerHTML, 10) + 1;
			},
			error: function (data) {
				console.log("not found " + GTINs[i]);
				
	
			}
		});
	}

});

function printCardProduct(objet, container) {
	try {
		var imgProductUrl = "img/noPhoto.png";
		if (objet['referencedFiles']){
			if (objet['referencedFiles']['referencedFile']) {
				if (Array.isArray(objet['referencedFiles']['referencedFile'])) {
					for (i = 0; i < objet['referencedFiles']['referencedFile'].length; i++) {
						if("PRODUCT_IMAGE" == objet['referencedFiles']['referencedFile'][i]['referencedFileTypeCode']){
							imgProductUrl =objet['referencedFiles']['referencedFile'][i]['uniformResourceIdentifier'];
						}
					}
				}else{
					if("PRODUCT_IMAGE" == objet['referencedFiles']['referencedFile']['referencedFileTypeCode']){
						imgProductUrl =objet['referencedFiles']['referencedFile']['uniformResourceIdentifier'];
					}
				}
			}
		}
		var origine = "undefined";
		if(objet['placeOfItemActivity']){
			if(objet['placeOfItemActivity']['countriesOfOrigin']){
				if(objet['placeOfItemActivity']){
					if(objet['placeOfItemActivity']['countriesOfOrigin']['countryOfOrigin']){
						origine = objet['placeOfItemActivity']['countriesOfOrigin']['countryOfOrigin'];
					}
				}
			}
		}
		container.innerHTML += `<div class="product_card " style="position: relative">
        <a target="_BLANK" href="productFull.html?gtin=${objet['gtin']}"><table width="100%">
            <tr>
				<td colspan="2" style="vertical-align:baseline">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830"
				class="bi bi-upc-scan" viewBox="0 0 16 16">
				<path
					d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
			</svg>
			<br>
			<span>${objet['gtin']} </span><br>
					
	              </td>
            </tr>
            <tr><td colspan="5"><hr></td></tr>

			<tr style="height:75px;vertical-align: top;">
				<td colspan=2>
				<h3>                    
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830" class="bi bi-box" viewBox="0 0 16 16">
						<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
					</svg>	
					${objet['tradeItemDescriptions']['tradeItemDescription'][0]['content']}</h3>
				
				</td>
			</tr>
			<tr style="vertical-align: top;">
				<td>
					<img src="${imgProductUrl}" style="width:auto;height:auto; max-height:120px;max-width:150px" onerror="this.src='img/noPhoto.png';">
				</td>
				<td style="text-align:left">
				<h4>								<svg fill="#3f7830" xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-trademark" width="16" height="16"
				viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="#3f7830"
				stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path d="M4.5 9h5m-2.5 0v6"></path>
				<path d="M13 15v-6l3 4l3 -4v6"></path>
			</svg>${objet['brandName']}</h4>
					<h4>
					<svg width="16px" height="16px" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
						<g fill="#3f7830" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round"
							stroke-linejoin="round" transform="translate(2 8)">
							<path
								d="m1.5.5h14c.5522847 0 1 .44771525 1 1v4c0 .55228475-.4477153 1-1 1h-14c-.55228475 0-1-.44771525-1-1v-4c0-.55228475.44771525-1 1-1z" />
							<path d="m3.5 1v2.5" />
							<path d="m5.5 1v2.5" />
							<path d="m7.5 1v3.5" />
							<path d="m9.5 1v2.5" />
							<path d="m11.5 1v2.5" />
							<path d="m13.5 1v3.5" />
						</g>
					</svg>
					${objet['tradeItemMeasurements']['netContents']['netContent']['content']} ${MeasurementUnitCodes[objet['tradeItemMeasurements']['netContents']['netContent']['measurementUnitCode']]}</h4>
				
				</td>
				<div style="position: absolute;right: 4px;bottom: 4px;text-align: right;z-index: 2;">
				<img width="32px" src="img/country/${origine}.svg">
					</div>

			</tr>
        </table>
        </a>
        
    </div>`;
	} catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	}



}