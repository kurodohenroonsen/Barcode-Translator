onmessage = function (e) {
  console.log('Message reçu depuis le script principal.');
  console.log(e.data[0]);
  var resultHTML = printCardWithDelete(e.data[0]);
  postMessage(resultHTML);
  console.log('Envoi du message de retour au script principal');
  console.log(resultHTML);
  

}

function printCardWithDelete(gtin) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/01_new/' + gtin + '/' + gtin + ".json", true);
  xhr.onload = function () {
    // do something to response
    producJson = JSON.parse(this.responseText);
    try {
      var html = `<div class="product_card container">
             
                <div class="product_card_netcontent label" onclick="window.location='productFull.html?gtin=${producJson['gtin']}';"">
                 Contenu net : <span class="netContent data">${producJson['netContent'] ? producJson['netContent']['s:value']['@value'] : '??'} ${producJson['netContent'] ? producJson['netContent']['s:unitCode'] : '??'}<span>
             </div>
             <div class="product_card_country" onclick="window.location='productFull.html?gtin=${producJson['gtin']}';">
               ${producJson['countryOfOrigin'] ? "<img class='imageCountry' src='img/country/" + producJson['countryOfOrigin'][0]['countryCode'] + ".svg'>" : ""}
             </div>
             
         
         
               <div class="product_card_image" style="background-color: white;background-image: url(${producJson['s:image'] ? producJson['s:image']['s:url']['@id'] : 'img/noPhoto.png'})" onclick="window.location='productFull.html?gtin=${producJson['gtin']}';"">
               </div>
               <div class="product_card_name">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12.36" height="12.36" viewBox="0 0 12.36 12.36">
                   <path id="scan"
                     d="M1.159.773a.386.386,0,0,0-.386.386V3.476a.386.386,0,1,1-.773,0V1.159A1.159,1.159,0,0,1,1.159,0H3.476a.386.386,0,1,1,0,.773ZM8.5.386A.386.386,0,0,1,8.884,0H11.2A1.159,1.159,0,0,1,12.36,1.159V3.476a.386.386,0,0,1-.773,0V1.159A.386.386,0,0,0,11.2.773H8.884A.386.386,0,0,1,8.5.386ZM.386,8.5a.386.386,0,0,1,.386.386V11.2a.386.386,0,0,0,.386.386H3.476a.386.386,0,1,1,0,.773H1.159A1.159,1.159,0,0,1,0,11.2V8.884A.386.386,0,0,1,.386,8.5Zm11.588,0a.386.386,0,0,1,.386.386V11.2A1.159,1.159,0,0,1,11.2,12.36H8.884a.386.386,0,1,1,0-.773H11.2a.386.386,0,0,0,.386-.386V8.884A.386.386,0,0,1,11.974,8.5ZM2.318,3.476a.386.386,0,0,1,.773,0V8.884a.386.386,0,1,1-.773,0Zm1.545,0a.386.386,0,1,1,.773,0V8.884a.386.386,0,1,1-.773,0Zm1.545,0a.386.386,0,1,1,.773,0V8.884a.386.386,0,1,1-.773,0Zm1.545,0a.386.386,0,0,1,.386-.386h.773a.386.386,0,0,1,.386.386V8.884a.386.386,0,0,1-.386.386H7.339a.386.386,0,0,1-.386-.386Zm2.318,0a.386.386,0,1,1,.773,0V8.884a.386.386,0,1,1-.773,0Z"
                     fill="#3f7830" />
                 </svg>
                 <span class="consultGtin" onclick="window.location='productFull.html?gtin=${producJson['gtin']}';">${producJson['gtin']}<span>
                 <h4 onclick="window.location='productFull.html?gtin=${producJson['gtin']}';">${producJson['s:name'][0]['@value'].length > "bereidingen van de soort 'Müsli', op basis van niet-".length ? producJson['s:name'][0]['@value'].substring(0, "bereidingen van de soort 'Müsli', op basis van niet-".length) + " ..." : producJson['s:name'][0]['@value']}</h4>`;

      if (producJson['ingredientStatement']) {
        var paragraph = producJson['ingredientStatement'][0]['@value'];
        const regex = /[0-9]{14}?@?[A-Z]{2}?/g;
        const found = paragraph.match(regex);
        if (found) {
          html += '<span style="font-size:0.8em">Ingrédients :</span><br> ';
          for (var k = 0; k < found.length; k++) {

            var country = found[k].substr(15, found[k].length);
            var gtin = found[k].substr(0, 14);
            html += "<img class='image_product_card_ingradients' src='/01_new/" + gtin + "/" + gtin + ".png' title='" + gtin + "'><img class='imageCountry_card_ingradients' src='img/country/" + country + ".svg' title='" + country + "'>&nbsp;"
          }

          console.log(found);
        }

      }
      html += `<br><span style="font-size:0.8em">Allergènes :</span><br>`;
      if (producJson['hasAllergen']) {

        var elems = producJson['hasAllergen'];
        for (var i = 0; i < elems.length; i++) {
          var elem = elems[i];
          if (elem['allergenLevelOfContainmentCode']['@id'].includes('CONTAIN')) {
            html += `<img src="img/allergen/${elem['allergenType']['@id']}.svg" class="image_product_card_ingradients ${elem['allergenType']['@id']}"/>&nbsp;`;

          }
        }
      }

      html += `</div>`;
      if (producJson['s:manufacturer']) {
        if (producJson['s:manufacturer']['s:image']) {

          html += `<img class="product_card_manufacturer_logo" src='${producJson['s:manufacturer']['s:image']['s:url']}' >`;
        }


      }
      if (producJson['additionalProductClassification']) {
        html += '<div class="score_card">'
        for (var k = 0; k < producJson['additionalProductClassification'].length; k++) {
          var classification = producJson['additionalProductClassification'][k];
          if (classification["additionalProductClassificationCode"] == "NUTRISCORE") {
            var nutriscoreValue = classification["additionalProductClassificationValue"]
            html += "&nbsp;<img class='score_card_image' src='img/score/" + nutriscoreValue + ".svg' title='" + nutriscoreValue + "'>"
          }
          if (classification["additionalProductClassificationCode"] == "ECOSCORE") {
            var nutriscoreValue = classification["additionalProductClassificationValue"]
            html += "&nbsp;<img class='score_card_image' src='img/score/" + nutriscoreValue + ".svg' title='" + nutriscoreValue + "'>"
          }
          if (classification["additionalProductClassificationCode"] == "NOVA") {
            var nutriscoreValue = classification["additionalProductClassificationValue"]
            html += "&nbsp;<img class='score_card_image' src='img/score/" + nutriscoreValue + ".svg' title='" + nutriscoreValue + "'>"
          }
        }
        html += '</div>'
      }
      html += `</div>`;
      return html;
    } catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }

  };
  xhr.send();



}
