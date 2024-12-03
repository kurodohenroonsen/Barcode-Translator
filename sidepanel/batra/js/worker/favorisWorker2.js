onmessage = function(e) {
	console.log('Message reçu depuis le script principal.');
    console.log(e);
    console.log(e.data[0]['gtin']);
    console.log(e.data[1]);
	var workerResult = 'Résultat : ' + (e.data[0] * e.data[1]);
  
	postMessage(printCardWithDelete(e.data[0], e.data[1], e.data[2]));
    console.log('Envoi du message de retour au script principal');
  
  }

  function printCardWithDelete(objet,recallAFSCAGtin, recallDGCCRFGtin) {
    try {
        var gtin = objet['gtin'];
        var recallDisplay = 'none';
               
        if(gtin){
            var gtin13 = gtin.substring(1, gtin.length);
            var recall = recallAFSCAGtin[gtin13];
            if(recall){
                recallDisplay='block';
            }
            recall = recallDGCCRFGtin[gtin13];
            if(recall){
                recallDisplay='block';
            }
        }

        $.ajax({
            url: 'offers_published/' + gtin + '_colruyt.html',
            type: 'GET',
            success: function (htmlOffer) {
                console.log("offers colruyt: ");
                
    
            },
            error: function (data) {
                console.log("ERROR offers colruyt: ");
    
    
            }
        });

        var image = objet.image;
        var find = '<div class="top-right" id="OFF_image">';
        var re = new RegExp(find, 'g');
        image = image.replace(re, '');
        find = '<img style="width: 50px !important"';
        re = new RegExp(find, 'g');
        image = image.replace(re, '');
        find = ' </div>';
        re = new RegExp(find, 'g');
        image = image.replace(re, '');
        find = 'src="img/logoOFF.png">';
        re = new RegExp(find, 'g');
        image = image.replace(re, '');
        find = 'src="img/logoOFF.png">';
        re = new RegExp(find, 'g');
        image = image.replace(re, '');
        find = 'max-width: 100%';
        re = new RegExp(find, 'g');
        image = image.replace(re, 'max-width: 100px;');
        find = 'max-height: 400px';
        re = new RegExp(find, 'g');
        image = image.replace(re, 'max-height: 100px;');
        if(!image.includes('max-height')){
            find = 'max-width: 100px';
            re = new RegExp(find, 'g');
            image = image.replace(re, 'max-width: 100px;max-height: 100px;');
        }

        var category = objet.category;
        var name = objet.name;

        var label = objet.label;
        if(objet.label){
            find = 'src="img/score/';
            re = new RegExp(find, 'g');
            label = label.replace(re, 'style="width:auto; margin:2px;max-height:20px !important" src="img/score/');
            find = 'src="img/label/';
            re = new RegExp(find, 'g');
            label = label.replace(re, 'style="width:14px; margin:2px" src="img/label/');
        }
        var content = objet.content;
        if(objet.content){
            find = '<td class="td_data">';
            re = new RegExp(find, 'g');
            content = content.replace(re, '');
            find = '<td style="width: 40%;">';
            re = new RegExp(find, 'g');
            content = content.replace(re, '');
            content = content.replace('</td>', '');
       }



        var last_consult = objet.last_consult;
        var origine = objet.db_origine;
        find = 'style="height: 33px';
        re = new RegExp(find, 'g');
        origine = origine.replace(re, 'style="height: 16px;"');

        var countryOrigine = objet.countryOrigine;
        find = '\n\t\t\t\t\t\t\t\t';
        re = new RegExp(find, 'g');
        countryOrigine = countryOrigine.replace(re, '');
        find = 'width: 24px;';
        re = new RegExp(find, 'g');
        countryOrigine = countryOrigine.replace(re, 'width: 15px;');

        var allergens = objet.allergens;
        find = '<span id=';
        re = new RegExp(find, 'g');
        allergens = allergens.replace(re, '<span class="label_img_container_card" id=');
        find = '<img class="label_img';
        re = new RegExp(find, 'g');
        allergens = allergens.replace(re, '<img class="label_img_card');
        find = 'label_img_BAD';
        re = new RegExp(find, 'g');
        allergens = allergens.replace(re, 'label_img_card_BAD');


        var additifs = objet.additifs;
        find = 'height="60"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'height="16"');
        find = 'width="60"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'width="16"');
        find = 'cx="30"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'cx="7"');
        find = 'cy="30"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'cx="6"');
        find = 'width="60"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'width="16"');
        find = 'r="30"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'r="20"');
        find = 'x="10"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'x="3"');
        find = 'y="38"';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'y="10"');
        find = '1em';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, '0.3em');
        find = 'class="label_img';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'class="label_img_card');
        find = 'label_img_BAD';
        re = new RegExp(find, 'g');
        additifs = additifs.replace(re, 'label_img_card_BAD');
        return `<div class="product_card" style="position: relative">
        <a class="card-link" href="productFull.html?gtin=${gtin}" ><table>
            <tr>
                <td style="width: 45%;height: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830"
                    class="bi bi-clock-history" viewBox="0 0 16 16">
                        <path
                            d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                        <path
                            d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                    </svg><br>
                    <span>${last_consult}</span>	
                                           
                </td>
                <td colspan="2" style="vertical-align:baseline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830"
                    class="bi bi-upc-scan" viewBox="0 0 16 16">
                    <path
                        d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                </svg>
                <br>
                <span>${gtin}</span><br>
                <span>${countryOrigine}</span>
                </td>
            </tr>
            <tr><td colspan="5"><hr></td></tr>
            <tr>
        
        
                <td>
                ${image}
                </td>
                <td style="height: 105px;">
               
                
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830" class="bi bi-box" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                    </svg>	
                    
                    <span  style='display: -webkit-box; -webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;'>${name}</span>
                
                    
                    <span>${content}</span>
                    
                
                </td>
        
            </tr>
            <tr><td colspan="5"><hr></td></tr>
            <tr style="height:75px;vertical-align: top;">
                <td>
                    <div style="margin:auto" class="scrollable smallScrollCard">
                        ${label}

                        ${allergens}

                        ${additifs}
                    </div>
                </td>								
                <td style="vertical-align: top;" colspan=2>
        
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3f7830" class="bi bi-tag-fill" viewBox="0 0 16 16">
                        <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                    <span  style='display: -webkit-box; -webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;'> ${category}</span>
                </td>
        
        
            </tr>
        
        </table>
        </a>
         <div style="position: absolute;right: 4px;top: 4px;text-align: right;z-index: 2;">
            <svg xmlns="http://www.w3.org/2000/svg" onclick="showDeleteDialog(event,'${gtin}');"
                class="icon icon-tabler icon-tabler-trash deleteFavory" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
            </svg>
        </div>
        <div style="position: absolute;left: 4px;top: 4px;text-align: right;z-index: 2;">
             ${origine}	
        </div>
        <div style="position: absolute;right: 4px;bottom: 4px;text-align: right;z-index: 2;display:${recallDisplay}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-megaphone-fill"
                viewBox="0 0 16 16">
                <path
                    d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z" />
            </svg>	
        </div>
    </div>`;
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}
