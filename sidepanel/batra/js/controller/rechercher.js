

function activateMenuItem() {
	document.getElementById("nav-link_rechercher").classList.add("nav-link_actif");
	document.getElementById("nav-link_mobile_rechercher").classList.add("nav-link_actif");
	document.getElementById("loadingPanel").style.display = "none";

}

function searchProduct() {
	var gtin = document.getElementById("gtin").value;
	if (gtin.length < 14) {
		if (gtin.length == 8) {
			document.getElementById("gtin").value = "000000" + document.getElementById("gtin").value;
		} else {
			document.getElementById("gtin").value = "0" + document.getElementById("gtin").value;
		}
	}
}
var urlExists = function (url, callback) {

	if (!$.isFunction(callback)) {
		throw Error('Not a valid callback');
	}

	$.ajax({
		type: 'HEAD',
		url: url,
		success: $.proxy(callback, this, true),
		error: $.proxy(callback, this, false)
	});

};
(function () {
	// If GPC on, set DOM property to true if not already true
	if (true) {
		if (navigator.globalPrivacyControl) return
		Object.defineProperty(navigator, 'globalPrivacyControl', {
			value: true,
			enumerable: true
		})
	} else {
		// If GPC off, set DOM property prototype to false so it may be overwritten
		// with a true value by user agent or other extensions
		if (typeof navigator.globalPrivacyControl !== "undefined") return
		Object.defineProperty(Object.getPrototypeOf(navigator), 'globalPrivacyControl', {
			value: false,
			enumerable: true
		})
	}
	// Remove script tag after execution
	document.currentScript.parentElement.removeChild(document.currentScript)
})()
const codeReader = new ZXing.BrowserMultiFormatReader()
function changeCamera(select) {
	codeReader.decodeFromVideoDevice(select.value, 'video', (result, err) => {
		if (result) {

			console.log(result);
			var playPromise = audio.play();
			var checkSum = result.text.split('').reduce(function (p, v, i) {
				return i % 2 == 0 ? p + 1 * v : p + 3 * v;
			}, 0);
			if (checkSum % 10 != 0) {
				alert('error');
			} else {
				if (result.text.length == 13) {
					window.location.href = "productFull.html?gtin=0" + result.text;
				} else {
					window.location.href = "productFull.html?gtin=000000" + result.text;

				}
			}
			var url = "https://www.batra.link/01/0" + result.text + "/0" + result.text + ".html";
			window.location.href = "productFull.html?gtin=0" + result.text;

			/*urlExists(url, function (success) {
				if (success) {
					window.location.href = url;
				} else {
					window.location.href = "https://www.batra.link/OpenFoodFact.html?gtin=" + result.text;
				}
			});
*/
		}

	})
}
window.addEventListener('load', function () {
	drawline(x1, y1, x2, y2);
	let selectedDeviceId;

	console.log('ZXing code reader initialized')
	codeReader.listVideoInputDevices()
		.then((videoInputDevices) => {
			const sourceSelect = document.getElementById('sourceSelect')
			selectedDeviceId = videoInputDevices[0].deviceId
			if (videoInputDevices.length >= 1) {
				videoInputDevices.forEach((element) => {
					const sourceOption = document.createElement('option')
					sourceOption.text = element.label
					sourceOption.value = element.deviceId
					sourceSelect.appendChild(sourceOption)
				})

			}

			codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
				if (result) {

					console.log(result);
					var playPromise = audio.play();
					var checkSum = result.text.split('').reduce(function (p, v, i) {
						return i % 2 == 0 ? p + 1 * v : p + 3 * v;
					}, 0);
					if (checkSum % 10 != 0) {
						alert('error');
					} else {
						document.getElementById('resultat').innerHTML = result;
						setTimeout(function () {

							if (result.text.length == 13) {
								window.location.href = "productFull.html?gtin=0" + result.text;
							} else {
								window.location.href = "productFull.html?gtin=000000" + result.text;

							}
							/*
							urlExists(url, function (success) {
								if (success) {
									window.location.href = "productFull.html?gtin=0" + result.text;
			
								} else {
									//window.location.href = "https://www.batra.link/OpenFoodFact.html?gtin=" + result.text;
								}
							});
*/

						}, 4000);

					}
				}
			})
		})
})

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



function drawline(ax, ay, bx, by) {
	if (ax > bx) {
		bx = ax + bx;
		ax = bx - ax;
		bx = bx - ax;
		by = ay + by;
		ay = by - ay;
		by = by - ay;
	}

	var angle = Math.atan((ay - by) / (bx - ax));

	angle = (angle * 180 / Math.PI);
	angle = -angle;

	var length = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));

	var containerVideo = document.getElementById('video');


	var style = ""
	style += "left:20px;"
	style += "top:-" + (containerVideo.clientHeight / 2) + "px;"
	style += "width: " + (containerVideo.clientWidth - 40) + "px;"
	style += "height:3px;"
	style += "background-color:red;"
	style += "position:relative;"
	style += "transform:rotate(" + angle + "deg);"
	style += "-ms-transform:rotate(" + angle + "deg);"
	style += "transform-origin:0% 0%;"
	style += "-moz-transform:rotate(" + angle + "deg);"
	style += "-moz-transform-origin:0% 0%;"
	style += "-webkit-transform:rotate(" + angle + "deg);"
	style += "-webkit-transform-origin:0% 0%;"
	style += "-o-transform:rotate(" + angle + "deg);"
	style += "-o-transform-origin:0% 0%;"
	style += "-webkit-box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, .1);"
	style += "box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, .1);"
	style += "z-index:99;"
	style += "animation-name: barcodeScannerLine; animation-duration: 1s;animation-iteration-count:infinite;"
	$("<div style='" + style + "'></div>").appendTo('#containerVideo');
}
var audio = new Audio('sound/beep.mp3');
var x1 = 0, y1 = 0,
	x2 = 0, y2 = 0;





