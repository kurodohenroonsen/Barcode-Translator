onmessage = function (e) {
  console.log('Message reçu depuis le script principal.');
  console.log(e.data);
  var resultHTML = filterProduct(e.data["profilsLoaded"], e.data["selectedProducts"], e.data["allergensDB"]);
  postMessage(resultHTML);
  console.log('Envoi du message de retour au script principal');
  console.log(resultHTML);
  

}

function filterProduct(arrayAllergenCodes, selectedProducts,allergensDB) {
  for (var i = 0; i < arrayAllergenCodes.length; i++) {
    var productsWithAllergen = allergensDB[arrayAllergenCodes[i]];
    for (var k = 0; k < productsWithAllergen.length; k++) {
      selectedProductsIndex = selectedProducts.indexOf(productsWithAllergen[k]);
      if("03263670001235"==productsWithAllergen[k]){
        console.log("03263670001235");
      }
      if (selectedProductsIndex > -1) {
        selectedProducts.splice(selectedProductsIndex, 1);
      }
    }
  }
  return selectedProducts;
}
