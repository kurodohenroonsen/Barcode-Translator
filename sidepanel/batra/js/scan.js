var pageTTS = `Rechercher un produit grâce à son identifiant unique (8 ou 13 caractères) se trouvant sous le code barre, scan le code ou introduit le nombre.
`
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


var bacodeScanned = [];
var lastResult;
async function onScanSuccess(decodedText, decodedResult) {
	console.log("1. Scan result : " + decodedResult);
	if (decodedText !== lastResult) {
		lastResult = decodedText;


		// Vérification du format
		if (decodedResult['result']['format']['formatName'] === 'EAN_13') {
            window.location.href = "productFull.html?gtin=0"+decodedText;

		}
	}
}
var html5QrcodeScanner;

//speak('Please scan the barcode with your webcam, if not prossible, please type the number which are under the little black bars!');
html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);




