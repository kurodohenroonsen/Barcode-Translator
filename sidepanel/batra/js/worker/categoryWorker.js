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
       return `<div class="category_card " style="position: relative">
        <a href="categorie.html?GPC=${objet['gpc']}&page=0&nbrPage=${objet['cptPages']}"><table width="100%">
            <tr>
                <td colspan="2" style="height: 34px;">
					<h4>${GPCCodes[objet['gpc']]["fr"]}</h4>
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
					<img src="img/gpc/${objet['gpc']}.jpg" style="width:auto;height:auto; max-height:150px;max-width:250px">
                </td>
            </tr>

        
        </table>
        </a>
        
    </div>`
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}
