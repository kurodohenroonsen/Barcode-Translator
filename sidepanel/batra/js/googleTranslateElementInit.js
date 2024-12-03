function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'paramPageLanguage',
        layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT,
        autoDisplay: false
    }, 'google_translate_element2');
    var select = document.getElementsByClassName('goog-te-combo')[0];
    var userLang = navigator.language || navigator.userLanguage;

    if (userLang.indexOf('fr') == -1 && !localStorage.getItem("batra_language")) {
        setTimeout(function () {
            // alert("The language is: " + userLang.substring(0, 2));
            select.value = userLang.substring(0, 2);
            select.addEventListener('click', function () {
                select.dispatchEvent(new Event('change'));
            });
            select.click();
            var popupDialog = document.getElementById("popupDialog");
            var gtinNotFound =  document.getElementById("gtinNotFound");
            var modalContainer =  document.getElementById("modalContainer");
            modalContainer.style.display = "flex";
            popupDialog.show()
            setTimeout(function () {
                var closeTrad = document.getElementById(':1.container').style.display = "none";
                document.body.style.top = "0px";
            }, 500);
        }, 1000);
    }
    if (localStorage.getItem("batra_language")) {
        setTimeout(function () {
            if (localStorage.getItem("batra_language").indexOf('fr') == -1) {
                // alert("The language is: " + userLang.substring(0, 2));
                select.value = localStorage.getItem("batra_language")
                select.addEventListener('click', function () {
                    select.dispatchEvent(new Event('change'));
                });
                select.click();
                setTimeout(function () {
                    var closeTrad = document.getElementById(':1.container').style.display = "none";
                    document.body.style.top = "0px";
                }, 500);
            }
        }, 1000);

    }
    select.addEventListener('change', function () {
        localStorage.setItem("batra_language", this.value);
        setTimeout(function () {
            var closeTrad = document.getElementById(':1.container').style.display = "none";
            document.body.style.top = "0px";
        }, 500);
    });
}
