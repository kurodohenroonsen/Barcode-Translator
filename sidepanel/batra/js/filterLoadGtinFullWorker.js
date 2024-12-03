onmessage = function (e) {
  console.log('Message reçu depuis le script principal.');
  console.log(e.data);
  var resultHTML = filterProduct(e.data["gtins_full"]);
  postMessage(resultHTML);
  console.log('Envoi du message de retour au script principal');
  console.log(resultHTML);
  

}

function filterProduct(gtins_full) {
  var dataListContent = "";
  var productGtins = Object.keys(gtins_full);
  for (var j = 0; j < productGtins.length; j++) {
    product = gtins_full[productGtins[j]]
    dataListContent += '<option value="' + product["gtin"] + '">' + product["gtin"] + ' - ' + product["s:name"][0]["@value"] + '</option>';
 
  }
  
  return dataListContent;
}
