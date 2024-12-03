Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}
var d = new Date;
let dformat = [d.getFullYear(), (d.getMonth() + 1).padLeft(), d.getDate().padLeft()].join('/') + ' ' + [d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join(':');

let db = new Localbase('db');
let hasAlert = false;
let hasAlertOK = false;
let hasAlertNOTOK = false;
var gtin;
var noImage = "true";
var jsonLD;
var NutrientPersoGlobal = new Array();
var hasIncoContact = false;
var hasIncoName = false;
var hasIncoAllergen = false;
var hasIncoIngredient = false;
var hasIncoNutrifacts = false;
var hasIncoNetContent = false;
var hasIncoDLC = false;
var hasIncoOrigin = false;
var hasIncoAlcohol = false;
var hasIncoPreparationInstructions = false;
var hasIncoConsumerUsageInstructions = false;
var hasIncoConsumerStorageInstructions = false;
var isAlcohol = false;
var isFish = false;
var isMeat = false;

async function addToHistory() {
    var image = document.getElementById("images").innerHTML;
    var category = document.getElementById("tradeItemClassification.gpcCategoryCode").innerHTML;
    var name = document.getElementById("tradeItemDescriptions").innerHTML;
    var label = document.getElementById("score_label_certification_container").innerHTML;
    var content = document.getElementById("tradeItemMeasurements.netContents.netContent_container").innerHTML;

    var origine = document.getElementById("origin_container").innerHTML;
    var countryOrigine = document.getElementById("placeOfItemActivity.countriesOfOrigin_container").innerHTML;
    var allergens = document.getElementById("allergenInformation.allergens").innerHTML;
    var additifs = document.getElementById("additifs_container").innerHTML;
    db.collection('historique').add({
        id: gtin,
        last_consult: dformat,
        db_origine: origine,
        countryOrigine: countryOrigine,
        content: content,
        gtin: gtin,
        name: name,
        allergens: allergens,
        additifs: additifs,
        label: label,
        category: category,
        image: image
    }, gtin);


}


async function addToFavoris() {
    var image = document.getElementById("images").innerHTML;
    var category = document.getElementById("tradeItemClassification.gpcCategoryCode").innerHTML;
    var name = document.getElementById("tradeItemDescriptions").innerHTML;
    var label = document.getElementById("score_label_certification_container").innerHTML;
    var content = document.getElementById("tradeItemMeasurements.netContents.netContent_container").innerHTML;

    var origine = document.getElementById("origin_container").innerHTML;
    var countryOrigine = document.getElementById("placeOfItemActivity.countriesOfOrigin_container").innerHTML;
    var allergens = document.getElementById("allergenInformation.allergens").innerHTML;
    var additifs = document.getElementById("additifs_container").innerHTML;
    db.collection('favoris').add({
        id: gtin,
        last_consult: dformat,
        db_origine: origine,
        countryOrigine: countryOrigine,
        content: content,
        gtin: gtin,
        name: name,
        allergens: allergens,
        additifs: additifs,
        label: label,
        category: category,
        image: image
    }, gtin);
    var favoris = document.getElementById("favoris");
    favoris.innerHTML = `							
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#3f7834"
        class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
    </svg>`
}

async function checkFavoris() {
    await db.collection('favoris').orderBy('gtin', 'desc').get().then(favoris => {
        for (var i = 0; i < favoris.length; i++) {
            var gtinfavoris = favoris[i].gtin;
            if (gtinfavoris == gtin) {
                var favoris = document.getElementById("favoris");
                favoris.innerHTML = `							
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#3f7834"
                    class="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>`
            }
        }

    })
}


function activateMenuItem() {
    document.getElementById("nav-link_rechercher").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_rechercher").classList.add("nav-link_actif");
}



async function chargeScoresFromOFF() {
    gtin13 = gtin.substr(1, gtin.length);


    $.get("https://fr.openfoodfacts.org/api/v0/product/" + gtin13, function(data) {
        const obj = JSON.parse(JSON.stringify(data));
        console.log(obj);
        if ("1" == obj.status) {
            if (obj["product"]["ecoscore_grade"]) {
                if (obj["product"]["ecoscore_grade"] == "unknown" || obj["product"]["ecoscore_grade"] == "not-applicable") {

                } else {
                    var ecoscore = new Object();
                    ecoscore['ecoscore'] = obj["product"]["nova_group"];
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = "ecoscore[0]";
                    parentContainer.appendChild(node);
                    printNovascore(ecoscore, node);
                }
            }
            if (obj["product"]["nova_group"]) {
                if (obj["product"]["nova_group"] == "unknown") {

                } else {
                    var novascore = new Object();
                    novascore['novascore'] = 'ECOSCORE_' + obj["product"]["nova_group"];

                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = "novascore[0]";
                    parentContainer.appendChild(node);
                    printEcoscore(novascore, node);
                }
            }
            //OFFDiv.style.visibility = 'visible';
        }
    });
}
async function convertTiff(url) {
    $.get("convertTiff.php?url="+url+"&gtin=" + gtin, function(data) {
        noImage = false;
        document.getElementById("image").src = "tiff/"+gtin+".png";
        document.getElementById("fixedElement_referencedFiles.referencedFile.referencedFileTypeCode_PRODUCT_IMAGE").src = "tiff/"+gtin+".png";
        document.getElementById("OFF_image").style.visibility = 'hidden';
    });
}

async function chargePhotoFromOFF() {
    gtin13 = gtin.substr(1, gtin.length);
    $.get("https://fr.openfoodfacts.org/api/v0/product/" + gtin13, function(data) {
        const obj = JSON.parse(JSON.stringify(data));
        console.log(obj);
        var imgElem = document.getElementById("image");
        var imgElemFixed = document.getElementById("fixedElement_referencedFiles.referencedFile.referencedFileTypeCode_PRODUCT_IMAGE");
        if ("1" == obj.status) {
            if (!obj.product.image_url.includes("https:")) {
                var find = 'http:';
                var re = new RegExp(find, 'g');
                imgElem.src = obj.product.image_url.replace(re, "https");
                imgElemFixed.src = imgElem.src;
            } else {
                imgElem.src = obj.product.image_url;
                imgElemFixed.src = imgElem.src;
            }
            document.getElementById("OFF_image").style.visibility = 'visible';

        } else {
            imgElem.src = "img/noPhoto.png";
            imgElemFixed.src = imgElem.src;
        }
        addToHistory();
    });
}
var occurence = 0;

function loadJsonLD() {
    // var gtin = document.getElementById("gtinSearch").value;
    gtin = findGetParameter("gtin");
    var url = '';
    if (gtin.includes('_')) {
        occurence = gtin.split('_')[1];
        gtin = gtin.split('_')[0];
        url = '01/' + gtin + '/' + gtin + '_' + occurence + '.json';
    } else {
        url = '01/' + gtin + '/' + gtin + '.json';
    }
    gtin13 = gtin.substr(1, gtin.length);
    printSiga(gtin13, null);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(jsonLD) {
            console.log(jsonLD);
            //chargeScoresFromOFF();
            ratingJSONLD = "5";
            jsonLD = JSON.parse(JSON.stringify(jsonLD));
            console.log(jsonLD);
            recursifLoading(jsonLD, "");
            processLanguageElems();
            loadOffers();
            if (noImage) {
                chargePhotoFromOFF();
            } else {
                addToHistory();
            }
            /*GET OCCURENCEFILE*/
            url = '01/' + gtin + '/occurence.json';
            $.ajax({
                url: url,
                type: 'GET',
                success: function(jsonLD) {

                    for (var i = 0; i < jsonLD.length; i++) {
                        console.log("occurences : " + jsonLD[i]["informationProviderGLN"] + " - " + jsonLD[i]["informationProviderPartyName"] + " - " + jsonLD[i]["modifiedDate"]);
                    }
                    if (jsonLD.length > 1) {
                        if (occurence == 0) {
                            document.getElementById("previousLink").style.display = "none";
                            document.getElementById("nextLink").style.display = "block";
                            document.getElementById("nextLink").setAttribute('href', 'productFull.html?gtin=' + gtin + '_1');
                        } else if (occurence == 1) {
                            document.getElementById("previousLink").style.display = "block";
                            document.getElementById("nextLink").style.display = "block";
                            document.getElementById("previousLink").setAttribute('href', 'productFull.html?gtin=' + gtin);
                            document.getElementById("nextLink").setAttribute('href', 'productFull.html?gtin=' + gtin + '_' + (parseInt(occurence, 10) + 1));
                        } else {
                            document.getElementById("previousLink").style.display = "block";
                            document.getElementById("nextLink").style.display = "block";
                            document.getElementById("nextLink").setAttribute('href', 'productFull.html?gtin=' + gtin + '_' + (parseInt(occurence, 10) + 1));
                            document.getElementById("previousLink").setAttribute('href', 'productFull.html?gtin=' + gtin + '_' + (parseInt(occurence, 10) - 1));

                        }
                    } else {
                        document.getElementById("previousLink").style.display = "none";
                        document.getElementById("nextLink").style.display = "block";
                        document.getElementById("nextLink").setAttribute('href', 'productFull.html?gtin=' + gtin13);

                    }
                },
                error: function(data) {
                    console.log("occurences ERROR : " + data);
                }
            });
        },
        error: function(data) {

            jsonLD = getJSONFromOFF(gtin);

        }
    });




    /**
    var jsonLD = document.getElementById("jsonLD").innerHTML;
    jsonLD = JSON.parse(jsonLD);
    console.log(jsonLD);
    recursifLoading(jsonLD, "");
     */
}

function loadOffers() {
    if (gtin.length==13){
        gtin13 =gtin;
        gtin = "0"+gtin;
    }
    $.ajax({
        url: 'offers_published/' + gtin13 + '_carrefour.html',
        type: 'GET',
        success: function(htmlOffer) {
            console.log("offers carrefour : ");
            // console.log(htmlOffer);

            htmlOffer = htmlOffer.replace('href="/fr/', 'target="_BLANK" href="https://drive.carrefour.be/fr/');
            htmlOffer = htmlOffer.replace('</a>', '&nbsp;&nbsp;<img src="img/link.svg" width="12px></a>');
            htmlOffer = htmlOffer.replace('"b-lazy" src="', '"b-lazy" data="');
            htmlOffer = htmlOffer.replace('data-src', 'src');
            htmlOffer = "<img src='img/logo_carrefour.png' width='100px'><br>BELGIQUE<br><div style='max-width:320px'><canvas id='myChartCarrefour' width='200' height='200'></canvas></div>" + htmlOffer;
            var re = new RegExp('offerInflaCheck', 'g');

            htmlOffer = htmlOffer.replace(re, 'offerInflaCheckProduct');

            document.getElementById("offers").style.display = "block";
            document.getElementById("offer_carrefour").style.display = "block";
            document.getElementById("offer_carrefour").innerHTML = htmlOffer;
            var dates = new Array();
            var prices = new Array();
            var pricesColor = new Array();

            var elements = document.getElementsByClassName("offerDate_carrefour");
            for (i = elements.length - 1; i > -1; i--) {
                dates.push(elements[i].innerHTML);
            }
            elements = document.getElementsByClassName("offerPrice_carrefour");
            var re = new RegExp('€', 'g');
            for (i = elements.length - 1; i > -1; i--) {
                prices.push(elements[i].innerHTML.replace(re, ''));

            }
            elements = document.getElementsByClassName("offerPourcentage_carrefour");

            for (i = elements.length - 1; i > -1; i--) {

                if (elements[i].innerHTML.includes('+')) {
                    pricesColor.push('red');
                } else if (elements[i].innerHTML.includes('(')) {
                    pricesColor.push('green');
                } else {
                    pricesColor.push('orange');
                }


            }
            const ctx = document.getElementById('myChartCarrefour').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,

                    datasets: [{
                        borderColor: pricesColor,
                        backgroundColor: pricesColor,
                        data: prices,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false //This will do the task
                    }
                }
            });

        },
        error: function(data) {



        }
    });

    $.ajax({
        url: 'offers_published/' + gtin + '_colruyt.html',
        type: 'GET',
        success: function(htmlOffer) {
            console.log("offers colruyt: ");
            // console.log(htmlOffer);

            htmlOffer = "<img src='img/logo_colruyt.png' width='100px'><br>BELGIQUE<br><div style='max-width:320px'><canvas id='myChartColruyt' width='200' height='200'></canvas></div>" + htmlOffer;
            var re = new RegExp('offerInflaCheck', 'g');

            htmlOffer = htmlOffer.replace(re, 'offerInflaCheckProduct');

            re = new RegExp('/etc.clientlibs', 'g');

            htmlOffer = htmlOffer.replace(re, 'https://www.colruyt.be/etc.clientlibs');

            document.getElementById("offers").style.display = "block";
            document.getElementById("offer_colruyt").style.display = "block";
            document.getElementById("offer_colruyt").innerHTML = htmlOffer;

            var dates = new Array();
            var prices = new Array();
            var pricesColor = new Array();

            var elements = document.getElementsByClassName("offerDate_colruyt");
            for (i = elements.length - 1; i > -1; i--) {
                dates.push(elements[i].innerHTML);
            }

            elements = document.getElementsByClassName("offerPrice_colruyt");
            var re = new RegExp('€', 'g');
            for (i = elements.length - 1; i > -1; i--) {
                prices.push(elements[i].innerHTML.replace(re, ''));

            }

            elements = document.getElementsByClassName("offerPourcentage_colruyt");

            for (i = elements.length - 1; i > -1; i--) {
                if (elements[i].innerHTML.includes('+')) {
                    pricesColor.push('red');
                } else if (elements[i].innerHTML.includes('(')) {
                    pricesColor.push('green');
                } else {
                    pricesColor.push('orange');
                }


            }
            const ctx = document.getElementById('myChartColruyt').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,

                    datasets: [{
                        label: 'Prix relevé',
                        borderColor: pricesColor,
                        backgroundColor: pricesColor,
                        data: prices,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false //This will do the task
                    }
                }
            });

        },
        error: function(data) {



        }
    });
    $.ajax({
        url: 'offers_published/' + gtin + '_bioplanet.html',
        type: 'GET',
        success: function(htmlOffer) {
            console.log("offers bioplanet: ");
            // console.log(htmlOffer);

            htmlOffer = "<img src='img/logo_bioplanet.png' height='32px'><br>BELGIQUE<br><div style='max-width:320px'><canvas id='myChartBioplanet' width='200' height='200'></canvas></div>" + htmlOffer;
            var re = new RegExp('offerInflaCheck', 'g');

            htmlOffer = htmlOffer.replace(re, 'offerInflaCheckProduct');

            document.getElementById("offers").style.display = "block";
            document.getElementById("offer_bioplanet").style.display = "block";
            document.getElementById("offer_bioplanet").innerHTML = htmlOffer;

            var dates = new Array();
            var prices = new Array();
            var pricesColor = new Array();

            var elements = document.getElementsByClassName("offerDate_bioplanet");
            for (i = elements.length - 1; i > -1; i--) {
                dates.push(elements[i].innerHTML);
            }

            elements = document.getElementsByClassName("offerPrice_bioplanet");
            var re = new RegExp('€', 'g');
            for (i = elements.length - 1; i > -1; i--) {
                prices.push(elements[i].innerHTML.replace(re, ''));

            }

            elements = document.getElementsByClassName("offerPourcentage_bioplanet");

            for (i = elements.length - 1; i > -1; i--) {
                if (elements[i].innerHTML.includes('+')) {
                    pricesColor.push('red');
                } else if (elements[i].innerHTML.includes('(')) {
                    pricesColor.push('green');
                } else {
                    pricesColor.push('orange');
                }


            }
            const ctx = document.getElementById('myChartBioplanet').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,

                    datasets: [{
                        label: 'Prix relevé',
                        borderColor: pricesColor,
                        backgroundColor: pricesColor,
                        data: prices,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false //This will do the task
                    }
                }
            });

        },
        error: function(data) {



        }
    });
}

function recursifLoading(jsonObject, parentKey) {



    var keys = Object.keys(jsonObject);
    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];
        var containerData = document.getElementById(parentKey + "." + key + "_container");
        // AFFICHER LE CONTAINER LEUR SI L'ELEMENT HTML EXISTE
        if (parentKey == "") {
            containerData = document.getElementById(key + "_container");
        }
        var parentContainer = document.getElementById(parentKey);
        if (parentContainer) {
            parentContainer.innerHTML = "";
        }
        if (containerData) {
            containerData.style.display = "block";
        }
        var child = jsonObject[key];
        console.log("child [" + parentKey + "." + key + "]: " + child);
        var childKeys = Object.keys(child);
        // SI LE CHILD EST UN OBJECT --> APPEL RECURSIF 
        if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
            if (parentKey != "") {
                if (key == "allergen") {
                    hasIncoAllergen = true;
                    document.getElementById(parentKey).style.display = "grid";
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("DIV");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printAllergen(child, node);
                } else if (key == "nutrientHeader") {
                    hasIncoNutrifacts = true;
                    printNutrientHeader(child);
                } else if (key == "consumerStorageInstruction") {
                    hasIncoConsumerStorageInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "consumerUsageInstruction") {
                    hasIncoConsumerUsageInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "preparationInstruction") {
                    hasIncoPreparationInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "certificationInformation") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printCertificationInformation(child, node);
                } else if (key == "servingSuggestion") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "packagingMarkedLanguageCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printPackagingMarkedLanguageCode(child, node);
                } else if (key == "referencedFile") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printReferencedFile(child, node);
                } else if (key == "targetMarketSuggestedRetailPrices") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printTargetMarketSuggestedRetailPrices(child, node);
                } else if (key == "nutriscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printNutriscore(child, node);

                } else if (key == "ecoscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printEcoscore(child, node);
                } else if (key == "packagingMarkedDietAllergenCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLabelCertification(child, node);
                } else if (key == "packagingMarkedLabelAccreditationCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printMarkedLabelAccreditationCodes(child, node);
                } else if (key == "packagingMarkedFreeFromCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printPackagingMarkedFreeFromCodes(child, node);

                } else if (key == "tradeItemDescription") {
                    document.getElementById(parentKey).style.display = "block";
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                    printLanguageElem(child, node, parentKey + "_availableLangue_hidden", key);
                } else if (key == "regulatedProductName") {
                    hasIncoName = true;
                    document.getElementById("regulatedProductNames_container").style.display = "block";
                    var parentContainer = document.getElementById("regulatedProductNames");
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node,"regulatedProductNames_availableLangue", key);
                } else if (key == "provenanceStatement") {
                    document.getElementById(parentKey).style.display = "block";
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "tradeItemMarketingMessage") {
                    console.log(parentKey + "_container");
                    document.getElementById("marketingInformations_container").style.display = "block";
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);


                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "ingredientStatement") {
                    hasIncoIngredient = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printIngredients(child, node, parentKey + "_availableLangue", key);
                } else if (key == "countriesOfSale") {
                    var parentContainer = document.getElementById("countriesOfSale");
                    document.getElementById("countriesOfSale_container").style.display = "block";
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printCountriesOfSale(child, node);
                } else if (key == "nutriscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printNutriscore(child, node);

                } else if (key == "ecoscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printEcoscore(child, node);
                } else if (key == "novascores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printNovascore(child, node);
                } else if (key == "catchZones") {
                    hasIncoOrigin = true;
                    console.log(parentKey);
                    var parentContainer = document.getElementById("catchZones");
                    parentContainer.style.display = "block";
                    var parentContainer2 = document.getElementById(parentKey + ".catchZones_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer2.appendChild(node);
                    printCatchZone(child, node);
                } else if (key == "importClassification") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printImportation(child, node);

                } else if (key == "packagingMaterial") {
                    console.log(parentKey);

                    var parentContainer = document.getElementById(parentKey + "_container");
                    var re = new RegExp('n/a', 'g');

                    parentContainer.innerHTML = parentContainer.innerHTML.replace(re, '');

                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);

                    printPackagingMaterial(child, node);
                } else if (key == "countryOfOrigin") {
                    hasIncoOrigin = true;
                    console.log(parentKey);
                    var parentContainerparent = document.getElementById("countriesOfOrigin");
                    parentContainerparent.style.display = "block";
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);

                    printCountriesOfOrigine(child, node);
                } else if (key == "targetMarketTaxInformation") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);

                    printTargetMarketTaxInformation(child, node);
                } else if (key == "packagingTypeDescription") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "healthClaimDescription") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "targetMarketReturnablePackageDepositAmount") {
                    console.log(parentKey);

                    var parentContainer = document.getElementById(parentKey + "_container");
                    var re = new RegExp('n/a', 'g');

                    parentContainer.innerHTML = parentContainer.innerHTML.replace(re, '');
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);

                    printTargetMarketReturnablePackageDepositAmount(child, node);
                } else if (key == "compulsoryAdditiveLabelInformation") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child, node, parentKey + "_availableLangue", key);
                } else if (key == "countriesOfOrigin") {
                    hasIncoOrigin = true;
                    console.log(parentKey);
                    var parentContainerparent = document.getElementById("countriesOfOrigin");
                    parentContainerparent.style.display = "block";
                    var parentContainer = document.getElementById(parentKey + ".countriesOfOrigin_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[0]";
                    parentContainer.appendChild(node);

                    printCountriesOfOrigine(child['countryOfOrigin'], node);
                } else {
                    recursifLoading(child, parentKey + "." + key);
                }

            } else if (key == "image") {
                var parentContainer = document.getElementById("images");
                var node = document.createElement("SPAN");
                node.id = parentKey + "[" + [j] + "]";
                parentContainer.appendChild(node);
                printImage(child, node);
            } else if (key == "countriesOfSale") {
                var parentContainer = document.getElementById("countriesOfSale");
                document.getElementById("countriesOfSale_container").style.display = "block";
                var node = document.createElement("SPAN");
                node.id = parentKey + "[" + [j] + "]";
                parentContainer.appendChild(node);
                printCountriesOfSale(child, node);
            } else {
                recursifLoading(child, key);
            }


        } else
        // SI LE CHILD EST UN ARRAY --> APPEL RECURSIF SUR CHAQUE ELEMENT
        if (Array.isArray(child)) {
            for (var j = 0; j < child.length; j++) {
                console.log("**********************" + parentKey + "." + key + " ARRAY[" + j + "]****************************");
                if (key == "ingredientStatement") {
                    hasIncoIngredient = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printIngredients(child[j], node, parentKey + "_availableLangue", key);

                } else if (key == "nutrientHeader") {
                    hasIncoNutrifacts = true;
                    printNutrientHeader(child[j]);
                } else if (key == "tradeItemDescription") {
                    document.getElementById(parentKey).style.display = "block";
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue_hidden", key);
                } else if (key == "targetMarketReturnablePackageDepositAmount") {
                    console.log(parentKey);

                    var parentContainer = document.getElementById(parentKey + "_container");
                    var re = new RegExp('n/a', 'g');

                    parentContainer.innerHTML = parentContainer.innerHTML.replace(re, '');
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);

                    printTargetMarketReturnablePackageDepositAmount(child[j], node);
                } else if (key == "packagingMaterial") {
                    console.log(parentKey);

                    var parentContainer = document.getElementById(parentKey + "_container");
                    var re = new RegExp('n/a', 'g');

                    parentContainer.innerHTML = parentContainer.innerHTML.replace(re, '');
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);

                    printPackagingMaterial(child[j], node);
                } else if (key == "tradeItemMarketingMessage") {
                    console.log(parentKey + "_container");
                    document.getElementById("marketingInformations_container").style.display = "block";
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);


                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "regulatedProductName") {
                    hasIncoName = true;
                    document.getElementById("regulatedProductNames_container").style.display = "block";
                    var parentContainer = document.getElementById("regulatedProductNames");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, "regulatedProductNames_availableLangue", key);
                } else if (key == "compulsoryAdditiveLabelInformation") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "nutritionalClaim") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "healthClaimDescription") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "consumerStorageInstruction") {
                    hasIncoConsumerStorageInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "packagingTypeDescription") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "consumerUsageInstruction") {
                    hasIncoConsumerUsageInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "preparationInstruction") {
                    hasIncoPreparationInstructions = true;
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "provenanceStatement") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "servingSuggestion") {
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printLanguageElem(child[j], node, parentKey + "_availableLangue", key);
                } else if (key == "allergen") {
                    hasIncoAllergen = true;
                    console.log(parentKey);
                    document.getElementById(parentKey).style.display = "grid";
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("DIV");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printAllergen(child[j], node);
                } else if (key == "communicationChannel") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printCommunicationChannel(child[j], node);

                } else if (key == "certificationInformation") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + [j] + "]";
                    parentContainer.appendChild(node);
                    printCertificationInformation(child[j], node);
                } else if (key == "packagingMarkedLanguageCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey);
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printPackagingMarkedLanguageCode(child[j], node);
                } else if (key == "referencedFile") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printReferencedFile(child[j], node);
                } else if (key == "targetMarketSuggestedRetailPrices") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printTargetMarketSuggestedRetailPrices(child[j], node);
                } else if (key == "nutriscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printNutriscore(child[j], node);
                } else if (key == "ecoscores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printEcoscore(child[j], node);
                } else if (key == "novascores") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printNovascore(child[j], node);
                } else if (key == "packagingMarkedDietAllergenCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printLabelCertification(child[j], node);
                } else if (key == "packagingMarkedLabelAccreditationCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printMarkedLabelAccreditationCodes(child[j], node);
                } else if (key == "packagingMarkedFreeFromCode") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById("score_label_certification_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printPackagingMarkedFreeFromCodes(child[j], node);
                } else if (key == "importClassification") {
                    console.log(parentKey);
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);
                    printImportation(child[j], node);
                } else if (key == "countryOfOrigin") {
                    hasIncoOrigin = true;
                    console.log(parentKey);
                    var parentContainerparent = document.getElementById("countriesOfOrigin");
                    parentContainerparent.style.display = "block";
                    var parentContainer = document.getElementById(parentKey + "_container");
                    var node = document.createElement("SPAN");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer.appendChild(node);

                    printCountriesOfOrigine(child[j], node);
                } else if (key == "catchZones") {
                    hasIncoOrigin = true;
                    console.log(parentKey);
                    var parentContainer = document.getElementById("catchZones");
                    parentContainer.style.display = "block";
                    var parentContainer2 = document.getElementById(parentKey + ".catchZones_container");
                    var node = document.createElement("P");
                    node.id = parentKey + "[" + j + "]";
                    parentContainer2.appendChild(node);
                    printCatchZone(child[j], node);
                } else
                if (parentKey != "") {
                    recursifLoading(child[j], parentKey + "." + key);
                } else {
                    recursifLoading(child[j], key);
                }


            }
        } else if (key == "packagingMarkedDietAllergenCode") {
            console.log(parentKey);
            var parentContainer = document.getElementById("score_label_certification_container");
            var node = document.createElement("SPAN");
            node.id = parentKey + "[0]";
            parentContainer.appendChild(node);
            printLabelCertification(child, node);
        } else if (key == "packagingMarkedLabelAccreditationCode") {
            console.log(parentKey);
            var parentContainer = document.getElementById("score_label_certification_container");
            var node = document.createElement("SPAN");
            node.id = parentKey + "[0]";
            parentContainer.appendChild(node);
            printMarkedLabelAccreditationCodes(child, node);
        } else if (key == "packagingMarkedFreeFromCode") {
            console.log(parentKey);
            var parentContainer = document.getElementById("score_label_certification_container");
            var node = document.createElement("SPAN");
            node.id = parentKey + "[0]";
            parentContainer.appendChild(node);
            printPackagingMarkedFreeFromCodes(child, node);

        } else {
            var elemData = document.getElementById(parentKey + "." + key);
            // AFFICHER LA VALEUR SI L'ELEMENT HTML EXISTE
            if (parentKey == "") {
                elemData = document.getElementById(key);
            }

            if (elemData) {
                if ('measurementUnitCode' == key) {
                    elemData.innerHTML = MeasurementUnitCodes[child];
                    elemData.style.opacity = 1.0;
                } else if ('contactTypeCode' == key) {
                    elemData.innerHTML = ContactTypeCodes[child];
                    elemData.style.opacity = 1.0;

                } else if ('platformTypeCode' == key) {
                    elemData.innerHTML = PlatformTypeCodes[child]['fr'];
                    elemData.style.opacity = 1.0;
                } else if ('packagingTypeCode' == key) {
                    elemData.innerHTML = PackagingTypeCodes[child]['fr'];
                    elemData.style.opacity = 1.0;
                } else if ('packagingTermsAndConditionsCode' == key) {
                    elemData.innerHTML = PackagingTermsAndConditionsCodes[child]['fr'];
                    elemData.style.opacity = 1.0;
                } else if ('platformTermsAndConditionsCode' == key) {
                    elemData.innerHTML = PlatformTermsAndConditionsCodes[child]['fr'];
                    elemData.style.opacity = 1.0;
                } else if ('packagingMarkedRecyclableScheme' == key) {
                    elemData.innerHTML = PackagingMarkedRecyclableScheme[child];
                    elemData.style.opacity = 1.0;
                } else if (parentKey == 'manufacturer' && 'partyName' == key) {
                    elemData = document.getElementById("manufacturer.partyName");

                    elemData.innerHTML = child;
                    elemData.style.opacity = 1.0;
                } else if (parentKey == 'manufacturer' && 'gln' == key) {
                    elemData = document.getElementById("manufacturer.gln");
                    if(fabricants[child]){
                        elemData.innerHTML = child + '&nbsp;<a href="fabricant.html?GLN=' + child + '&page=0&nbrPage=' + fabricants[child]['cptPages'] + '"><img src="img/link.svg" width="12px"></a>';
                        
                    }elemData.style.opacity = 1.0;

                } else if (key == "gpcCategoryCode") {
                    var parentContainer = document.getElementById("tradeItemClassification.gpcCategoryCode");
                    if (isNaN(child)) {
                        parentContainer.innerHTML = child;
                        document.getElementById("img-topGPC").src = "img/gpc/inconnu.jpg";
                    } else {
                        var nbrPage = 1;
                        for (var i = 0; i < categories.length; i++) {
                            if (child == categories[i]['gcpCode']) {
                                nbrPage = categories[i]['cptPages'];
                            }
                        }
                        var categoyLink = "categorie.html?GPC=" + child + "&page=0&nbrPage=" + nbrPage;
                        parentContainer.innerHTML = GPCCodes[child]['fr'] + "&nbsp;&nbsp;<a href='" + categoyLink + "'><img src='img/link.svg' width='12px'></a>";
                        elemData.style.opacity = 1.0;
                        categoryJSONLD = GPCCodes[child]['fr'];
                        document.getElementById("img-topGPC").src = "img/gpc/" + child + ".jpg";
                    }

                } else if (key == "modifiedDate") {
                    var parentContainer = document.getElementById("metaData.modifiedDate");
                    elemData.style.opacity = 1.0;
                    parentContainer.innerHTML = child.substr(0, 10);
                } else if (key == "brand") {
                    brandJSONLD = child;
                    elemData.style.opacity = 1.0;
                    elemData.innerHTML = child;
                } else if (key == "netContent") {
                    hasIncoNetContent = true;
                    brandJSONLD = child;
                    elemData.style.opacity = 1.0;
                    elemData.innerHTML = child;
                } else {
                    elemData.style.opacity = 1.0;
                    elemData.innerHTML = child;
                }
            }
        }



        console.log("**********************************************************");
    }

}

function printTargetMarketTaxInformation(jsonObject, node) {
    var targetMarket = jsonObject['targetMarkets']['targetMarket'];

    node.innerHTML = `<img src="img/country/${targetMarket}.svg" width="24px"><br>`;
    var taxInformations = jsonObject['taxInformations']['taxInformation'];
    console.log('taxInformations' + taxInformations.length);
    if (taxInformations.length) {
        for (var i = 0; i < taxInformations.length; i++) {

            // node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode']+"("+TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr']+")<br>";
            if (taxInformations[i]['dutyFeeTaxRate'] && taxInformations[i]['dutyFeeTaxAmount']) {
                if (TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]) {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations[i]['dutyFeeTaxAmount']['content'] + taxInformations[i]['dutyFeeTaxAmount']['currencyCode'] + "(" + taxInformations[i]['dutyFeeTaxRate'] + "%)<br>";

                } else {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + " : " + taxInformations[i]['dutyFeeTaxRate'] + "%<br>";

                }

            } else
            if (taxInformations[i]['dutyFeeTaxRate']) {
                if (TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]) {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations[i]['dutyFeeTaxRate'] + "%<br>";

                } else {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + " : " + taxInformations[i]['dutyFeeTaxRate'] + "%<br>";

                }

            } else
            if (taxInformations[i]['dutyFeeTaxAmount']) {
                if (TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]) {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations[i]['dutyFeeTaxAmount']['content'] + taxInformations[i]['dutyFeeTaxAmount']['currencyCode'] + "<br>";

                } else {
                    node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + " : " + taxInformations[i]['dutyFeeTaxAmount']['content'] + taxInformations[i]['dutyFeeTaxAmount']['currencyCode'] + "<br>";

                }

            } else {
                node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr'] + ")" + "<br>";

            }
            if (taxInformations[i]['dutyFeeTaxCategoryCode']) {
                node.innerHTML += taxInformations[i]['dutyFeeTaxCategoryCode'] + " - " + TaxCategoryCodes[taxInformations[i]['dutyFeeTaxCategoryCode']]['fr'] + "<br><br>";
            }
        }
    } else {
        // node.innerHTML += taxInformations[i]['dutyFeeTaxTypeCode']+"("+TaxTypeCodes[taxInformations[i]['dutyFeeTaxTypeCode']]['fr']+")<br>";
        if (taxInformations['dutyFeeTaxRate'] && taxInformations['dutyFeeTaxAmount']) {
            if (TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]) {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations['dutyFeeTaxAmount']['content'] + taxInformations['dutyFeeTaxAmount']['currencyCode'] + "(" + taxInformations['dutyFeeTaxRate'] + "%)<br>";

            } else {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + " : " + taxInformations['dutyFeeTaxRate'] + "%<br>";

            }

        } else
        if (taxInformations['dutyFeeTaxRate']) {
            if (TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]) {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations['dutyFeeTaxRate'] + "%<br>";

            } else {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + " : " + taxInformations['dutyFeeTaxRate'] + "%<br>";

            }

        } else
        if (taxInformations['dutyFeeTaxAmount']) {
            if (TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]) {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]['fr'] + ")" + " : " + taxInformations['dutyFeeTaxAmount']['content'] + taxInformations['dutyFeeTaxAmount']['currencyCode'] + "<br>";

            } else {
                node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + " : " + taxInformations['dutyFeeTaxAmount']['content'] + taxInformations['dutyFeeTaxAmount']['currencyCode'] + "<br>";

            }

        } else {
            node.innerHTML += taxInformations['dutyFeeTaxTypeCode'] + "(" + TaxTypeCodes[taxInformations['dutyFeeTaxTypeCode']]['fr'] + ")" + "<br>";

        }
        if (taxInformations['dutyFeeTaxCategoryCode']) {
            node.innerHTML += taxInformations['dutyFeeTaxCategoryCode'] + " - " + TaxCategoryCodes[taxInformations['dutyFeeTaxCategoryCode']]['fr'] + "<br><br>";
        }
    }
}

function printTargetMarketReturnablePackageDepositAmount(jsonObject, node) {
    var returnablePackageDepositAmount = jsonObject['returnablePackageDepositAmount']['content'];
    var returnablePackageDepositCurrency = jsonObject['returnablePackageDepositAmount']['currencyCode'];
    var country = jsonObject['targetMarkets']['targetMarket'];

    node.innerHTML = `<img src="img/country/${country}.svg" width="24px">&nbsp;` + " : " + returnablePackageDepositAmount + returnablePackageDepositCurrency;
    node.innerHTML += "<br>";
}

function printPackagingMaterial(jsonObject, node) {
    var packagingMaterialTypeCode = PackagingMaterialTypeCodes[jsonObject['packagingMaterialTypeCode']]['fr'];
    if (jsonObject['packagingMaterialCompositionQuantities']){
        var packagingMaterialCompositionQuantity = jsonObject['packagingMaterialCompositionQuantities']['packagingMaterialCompositionQuantity']['content'];
        var packagingMaterialCompositionQuantityMeasurementUnitCode = jsonObject['packagingMaterialCompositionQuantities']['packagingMaterialCompositionQuantity']['measurementUnitCode'];

    }else{
        var packagingMaterialCompositionQuantity = "N/A";
        var packagingMaterialCompositionQuantityMeasurementUnitCode = "N/A";

    }
    
    var isPackagingMaterialRecoverable = jsonObject['isPackagingMaterialRecoverable'];
    console.log(isPackagingMaterialRecoverable);
  
    node.innerHTML = packagingMaterialTypeCode + " : " + packagingMaterialCompositionQuantity + MeasurementUnitCodes[packagingMaterialCompositionQuantityMeasurementUnitCode];
    if (isPackagingMaterialRecoverable) {
        node.innerHTML += " (recyclable)";

    } else if (!isPackagingMaterialRecoverable) {
        node.innerHTML += " (non recyclable)";



    }
    node.innerHTML += "<br>";
}

function printCatchZone(jsonObject, node) {
    var catchZoneCode = jsonObject;
    var catchZoneValue = CatchZones[catchZoneCode];

    node.innerHTML = catchZoneValue;
    node.style.opacity = 1.0;
}

function printImportation(jsonObject, node) {
    var importationCode = jsonObject['typeCode'];
    var importationValue = jsonObject['value'];

    node.innerHTML = importationCode + " : " + importationValue;
    node.style.opacity = 1.0;

}

function printMarkedLabelAccreditationCodes(jsonObject, node) {

    var freeFrom = jsonObject;
    node.innerHTML += `<img alt="${freeFrom}" title="${freeFrom}" class="label_img" src="img/label/${freeFrom}.jpg">`;
    node.style.opacity = 1.0;
    db.collection('label').orderBy('code', 'desc').get().then(labels => {
        for (var i = 0; i < labels.length; i++) {
            var code = labels[i].code;
            if (freeFrom == code) {
                hasAlert = true;
                hasAlertOK = true;
                document.getElementById("alert_pos").style.opacity = 1.0;
                var labelCertiAlert = document.getElementById("labelCertiAlert");
                labelCertiAlert.innerHTML += `<img alt="${LabelCodes[freeFrom]['nl']} - ${LabelCodes[freeFrom]['fr']} -${LabelCodes[freeFrom]['en']}" title="${LabelCodes[freeFrom]['fr']}" class="label_img" src="img/label/${freeFrom}.jpg">`;
                labelCertiAlert.style.opacity = 1.0;
            }
        }

    });

}

function printPackagingMarkedFreeFromCodes(jsonObject, node) {
    var label = jsonObject;

    node.innerHTML = `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.png">`;
    node.style.opacity = 1.0;
    db.collection('label').orderBy('code', 'desc').get().then(labels => {
        for (var i = 0; i < labels.length; i++) {
            var code = labels[i].code;
            if (label == code) {
                hasAlert = true;
                hasAlertOK = true;
                document.getElementById("alert_pos").style.opacity = 1.0;

                var labelCertiAlert = document.getElementById("labelCertiAlert");
                labelCertiAlert.innerHTML += `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.png">`;
                labelCertiAlert.style.opacity = 1.0;
            }
        }

    });



}

function printPackagingMarkedLabelAccreditationCode(jsonObject, node) {
    var label = jsonObject;
    node.innerHTML = `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.jpg">`;
    node.style.opacity = 1.0;
    db.collection('label').orderBy('code', 'desc').get().then(labels => {
        for (var i = 0; i < labels.length; i++) {
            var code = labels[i].code;
            if (label == code) {
                hasAlert = true;
                hasAlertOK = true;
                document.getElementById("alert_pos").style.opacity = 1.0;

                var labelCertiAlert = document.getElementById("labelCertiAlert");
                labelCertiAlert.innerHTML += `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.jpg">`;
                labelCertiAlert.style.opacity = 1.0;
            }
        }

    });
}

function printSiga(gtin13, node) {
    var sigaScore = Sigas[gtin13];
    if (sigaScore) {
        sigaScore = sigaScore.split('_')[1];
        sigaScore = sigaScore.split('.')[0];
        sigaScore = sigaScore.substr(0, 1);
        console.log(sigaScore);
        var hasParamSiga = false;
        var parentContainer = document.getElementById("score_label_certification_container");
        var node = document.createElement("SPAN");
        node.id = "siga";
        parentContainer.appendChild(node);
        db.collection('score').orderBy('code', 'desc').get().then(scores => {
            for (var i = 0; i < scores.length; i++) {
                if ("SIGA" == scores[i].code) {
                    hasParamSiga = true;
                    if (sigaScore > scores[i].value) {
                        hasAlert = true;
                        hasAlertNOTOK = true;
                        document.getElementById("alert_neg").style.opacity = 1.0;

                        var scoreAlert = document.getElementById("scoreAlert");
                        scoreAlert.innerHTML += `<img class="label_img label_img_BAD" src="img/score/SIGA_${sigaScore - 1}.svg">`;
                        node.innerHTML = `<img class="label_img label_img_BAD" src="img/score/SIGA_${sigaScore - 1}.svg">`;



                    } else {
                        hasAlert = true;
                        hasAlertOK = true;
                        document.getElementById("alert_pos").style.opacity = 1.0;

                        var scoreAlert = document.getElementById("scoreAlertOk");
                        scoreAlert.innerHTML += `<img class="label_img" src="img/score/SIGA_${sigaScore - 1}.svg">`;
                        node.innerHTML = `<img class="label_img" src="img/score/SIGA_${sigaScore - 1}.svg">`;

                    }
                }
            }
            if (!hasParamSiga) {
                node.innerHTML = `<img class="label_img" src="img/score/SIGA_${sigaScore - 1}.svg">`;
                node.style.opacity = 1.0;
            }
            addToHistory();
        });

    }
}

function printLabelCertification(jsonObject, node) {
    var label = jsonObject;
    node.innerHTML = `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.jpg">`;
    node.style.opacity = 1.0;
    var hasParamLabel = false;
    db.collection('label').orderBy('code', 'desc').get().then(labels => {
        for (var i = 0; i < labels.length; i++) {
            var code = labels[i].code;
            if (label == code) {
                hasParamSiga = true;
                hasAlert = true;
                hasAlertOK = true;
                document.getElementById("alert_pos").style.opacity = 1.0;

                var labelCertiAlert = document.getElementById("labelCertiAlert");
                labelCertiAlert.innerHTML += `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.jpg">`;
                labelCertiAlert.style.opacity = 1.0;
            }
        }
        if (!hasParamLabel) {
            labelCertiAlert.innerHTML += `<img alt="${LabelCodes[label]['nl']} - ${LabelCodes[label]['fr']} -${LabelCodes[label]['en']}" title="${LabelCodes[label]['fr']}" class="label_img" src="img/label/${label}.jpg">`;
            node.style.opacity = 1.0;
        }

    });
}

function printNutriscore(jsonObject, node) {
    let score = jsonObject['nutriscore'];
    let score_value = score.split("_")[1].charCodeAt(0) - 65;
    let score_code = score.split("_")[0];
    console.log("score_value" + score_value);
    var hasParamNutriscore = false;
    db.collection('score').orderBy('code', 'desc').get().then(scores => {

        for (var i = 0; i < scores.length; i++) {
            if (score_code == scores[i].code) {
                hasParamNutriscore = true;
                if (score_value > scores[i].value) {
                    hasAlert = true;
                    hasAlertNOTOK = true;

                    document.getElementById("alert_neg").style.opacity = 1.0;

                    var scoreAlert = document.getElementById("scoreAlert");
                    scoreAlert.innerHTML += `<img class="label_img label_img_BAD" src="img/score/${score}.svg">`;
                    scoreAlert.style.opacity = 1.0;
                    node.innerHTML = `<img class="label_img label_img_BAD" src="img/score/${score}.svg">`;
                    node.style.opacity = 1.0;


                } else {
                    document.getElementById("alert_pos").style.opacity = 1.0;
                    hasAlert = true;
                    hasAlertOK = true;
                    var scoreAlert = document.getElementById("scoreAlertOk");
                    scoreAlert.innerHTML += `<img class="label_img" src="img/score/${score}.svg">`;
                    scoreAlert.style.opacity = 1.0;
                    node.innerHTML = `<img class="label_img" src="img/score/${score}.svg">`;
                    node.style.opacity = 1.0;
                }
            }
        }
        if (!hasParamNutriscore) {
            node.innerHTML = `<img class="label_img" src="img/score/${score}.svg">`;
            node.style.opacity = 1.0;
        }
        addToHistory();
    });


}

function printEcoscore(jsonObject, node) {
    var score = jsonObject['ecoscore'];
    let score_value = score.split("_")[1].charCodeAt(0) - 65;
    let score_code = score.split("_")[0];
    var hasParamEcoscore = false;

    console.log("score_value" + score_value);
    db.collection('score').orderBy('code', 'desc').get().then(scores => {
        for (var i = 0; i < scores.length; i++) {
            if (score_code == scores[i].code) {
                hasParamEcoscore = true;
                if (score_value > scores[i].value) {
                    hasAlert = true;
                    hasAlertNOTOK = true;
                    document.getElementById("alert_neg").style.opacity = 1.0;

                    var scoreAlert = document.getElementById("scoreAlert");
                    scoreAlert.innerHTML += `<img class="label_img label_img_BAD" src="img/score/${score}.svg">`;
                    node.innerHTML = `<img class="label_img label_img_BAD" src="img/score/${score}.svg">`;
                    node.style.opacity = 1.0;


                } else {
                    hasAlert = true;
                    hasAlertOK = true;
                    document.getElementById("alert_pos").style.opacity = 1.0;

                    var scoreAlert = document.getElementById("scoreAlertOk");
                    scoreAlert.innerHTML += `<img class="label_img" src="img/score/${score}.svg">`;
                    node.innerHTML = `<img class="label_img" src="img/score/${score}.svg">`;
                    node.style.opacity = 1.0;
                }
            }
        }
        if (!hasParamEcoscore) {
            node.innerHTML = `<img class="label_img" src="img/score/${score}.svg">`;
            node.style.opacity = 1.0;
        }
        addToHistory();
    });

}

function printNovascore(jsonObject, node) {
    var score = jsonObject['novascore'];
    let score_value = score - 1;
    let score_code = "NOVA";
    var hasParamNovascore = false;
    console.log("score_value" + score_value);
    db.collection('score').orderBy('code', 'desc').get().then(scores => {
        for (var i = 0; i < scores.length; i++) {
            if (score_code == scores[i].code) {
                hasParamNovascore = true;
                if (score_value > scores[i].value) {
                    hasAlert = true;
                    hasAlertNOTOK = true;
                    document.getElementById("alert_neg").style.opacity = 1.0;

                    var scoreAlert = document.getElementById("scoreAlert");
                    scoreAlert.innerHTML += `<img class="label_img label_img_BAD" src="img/score/NOVA_${score_value}.svg">`;
                    node.innerHTML = `<img class="label_img label_img_BAD" src="img/score/NOVA_${score_value}.svg">`;


                } else {
                    hasAlert = true;
                    hasAlertOK = true;
                    document.getElementById("alert_pos").style.opacity = 1.0;

                    var scoreAlert = document.getElementById("scoreAlertOk");
                    scoreAlert.innerHTML += `<img class="label_img" src="img/score/NOVA_${score_value}.svg">`;
                    node.innerHTML = `<img class="label_img" src="img/score/NOVA_${score_value}.svg">`;
                }
            }
        }
        if (!hasParamNovascore) {
            node.innerHTML = `<img class="label_img" src="img/score/NOVA_${score_value}.svg">`;
            node.style.opacity = 1.0;
        }
        addToHistory();
    });

}

function printTargetMarketSuggestedRetailPrices(jsonObject, node) {
    var suggestedRetailPrices = jsonObject['targetMarketSuggestedRetailPrice'];
    var suggestedRetailPrice = suggestedRetailPrices['suggestedRetailPrices']['suggestedRetailPrice'];
    var price = suggestedRetailPrice['content'];
    var currencyCode = suggestedRetailPrice['currencyCode'];

    var countryOfSale = suggestedRetailPrices['targetMarkets']['targetMarket'];
    for (var l = 1; l < countryOfSale.length; l++) {
        node.innerHTML += `<img src='img/country/${countryOfSale[l]}.svg' style='width: 24px;'>&nbsp;`;
        node.style.opacity = 1.0;

    }
    node.innerHTML += "<br>" + price + currencyCode;

}

function printReferencedFile(jsonObject, node) {
    var referencedFileTypeCode = jsonObject['referencedFileTypeCode'];
    var fileName = jsonObject['fileName'];
    var fileEffectiveStartDateTime = jsonObject['fileEffectiveStartDateTime'];
    var fileFormatName = jsonObject['fileFormatName'];
    var uniformResourceIdentifier = jsonObject['uniformResourceIdentifier'];
    if ("PRODUCT_IMAGE" == referencedFileTypeCode) {
        if (uniformResourceIdentifier.indexOf('.tif') > -1) {
            document.getElementById("image").addEventListener('error', function() {
                convertTiff(uniformResourceIdentifier);
            }, false);  
            document.getElementById("image").src = "tiff/"+gtin+".png";
            document.getElementById("fixedElement_referencedFiles.referencedFile.referencedFileTypeCode_PRODUCT_IMAGE").src = "tiff/"+gtin+".png";
            node.innerHTML = `${ReferencedFileTypeCodes[referencedFileTypeCode]} : <a href="${uniformResourceIdentifier}" target="_BLANK"><img alt="${fileName} depuis le ${fileEffectiveStartDateTime}" src="img/tiff.svg" width="36px"></a>`;
            noImage = false;
             
        } else {
            noImage = false;
            node.innerHTML = `${ReferencedFileTypeCodes[referencedFileTypeCode]} : <a href="${uniformResourceIdentifier}" target="_BLANK"><img alt="${fileName} depuis le ${fileEffectiveStartDateTime}" src="${uniformResourceIdentifier}" width="36px"></a>`;
            document.getElementById("image").src = uniformResourceIdentifier;
            document.getElementById("fixedElement_referencedFiles.referencedFile.referencedFileTypeCode_PRODUCT_IMAGE").src = uniformResourceIdentifier

        }
    } else {
        node.innerHTML = `${ReferencedFileTypeCodes[referencedFileTypeCode]} : <a href="${uniformResourceIdentifier}" target="_BLANK"><img alt="${fileName} depuis le ${fileEffectiveStartDateTime}" src="img/${fileFormatName}.svg" width="36px"></a>`;
    }
    node.style.opacity = 1.0;

    imageJSONLD = uniformResourceIdentifier;

}

function printPackagingMarkedLanguageCode(jsonObject, node) {

    node.innerHTML = `<img src="img/country/${jsonObject}.svg" width="24px">&nbsp;`;
    node.style.opacity = 1.0;

}

function printLanguageElem(jsonObject, node, elemAvailableLanguage, key) {
    var language = jsonObject['languageCode'];
    var value = jsonObject['content'];

    node.classList.add("data");
    node.classList.add("language");
    node.classList.add(key);
    node.classList.add(language);
    node.innerHTML = value;
    node.style.opacity = 1.0;
    nameJSONLD = value;
    document.getElementById(elemAvailableLanguage).innerHTML += "<img onclick='selectThisLanguage(this, \"" + node.id + "\",\"" + key + "\" )' id='chooseLanguageFlag_" + language + "' class='chooseLanguageFlag " + language + " chooseLanguageFlag_" + key + "' src='img/country/" + language + ".svg' style='width: 15px;'>&nbsp;";

}

function printIngredients(jsonObject, node, elemAvailableLanguage, key) {
    var language = jsonObject['languageCode'];
    var value = jsonObject['content'];

    node.classList.add("data");
    node.classList.add("language");
    node.classList.add(key);
    node.classList.add(language);
    console.log("ingredient value : " + value);
    var find = ' ';
    var re = new RegExp(find, 'g');

    node.innerHTML = value.replace(re, ' ');
    //node.innerHTML = value.replaceAll(' ', ' ');
    node.style.opacity = 1.0;
    descriptionJSONLD = value;
    document.getElementById(elemAvailableLanguage).innerHTML += "<img onclick='selectThisLanguage(this, \"" + node.id + "\",\"" + key + "\" )' id='chooseLanguageFlag_" + language + "' class='chooseLanguageFlag " + language + " chooseLanguageFlag_" + key + "' src='img/country/" + language + ".svg' style='width: 15px;'>&nbsp;";

    var regexAdditif = /E[ ]?[0-9][0-9][0-9][0-9]?[a-z]?[(]?i?i?i?v?i?i?i?/g;
    var additifs = value.match(regexAdditif);
    console.log(additifs);
    if (additifs) {
        for (var l = 0; l < additifs.length; l++) {
            additifs[l] = additifs[l].replace("(", "");
            additifs[l] = additifs[l].replace(")", "");
            additifs[l] = additifs[l].replace(" ", "");
            let additifsCode = additifs[l];
            db.collection('additif').orderBy('code', 'desc').get().then(additif => {
                if (!document.getElementById("additifs_container").innerHTML.includes(">" + additifsCode + "<")) {

                    if (additif.filter(function(e) { return e.code === additifsCode }).length > 0) {
                        document.getElementById("alert_neg").style.opacity = 1.0;

                        hasAlert = true;
                        hasAlertNOTOK = true;
                        var additifAlert = document.getElementById("additifAlert");
                        additifAlert.innerHTML += `
                        <svg height="60" width="60" class="label_img label_img_BAD">
                            <circle cx="30" cy="30" r="30" fill="#c6cb2e" />
                            <text x="10" y="38" fill="black" font-size="1em">${additifsCode}</text>
                        </svg>
                        `
                        document.getElementById("additifs_container").innerHTML += `
                        <svg height="60" width="60" class="label_img label_img_BAD" >
                            <circle cx="30" cy="30" r="30" fill="#c6cb2e" />
                            <text x="10" y="38" fill="black" font-size="1em">${additifsCode}</text>
                        </svg>
                        `;
                    } else {
                        document.getElementById("additifs_container").innerHTML += `
                        <svg height="60" width="60" class="label_img">
                            <circle cx="30" cy="30" r="30" fill="#c6cb2e" />
                            <text x="10" y="38" fill="black" font-size="1em">${additifsCode}</text>
                        </svg>
                        `;
                    }
                }
                addToHistory();

            });



        }
    }


}

function printAllergen(jsonObject, node) {
    var allergenTypeCode = jsonObject['allergenTypeCode'];
    var levelOfContainmentCode = jsonObject['levelOfContainmentCode'];
    if ("CONTAINS" == levelOfContainmentCode || "MAY_CONTAIN" == levelOfContainmentCode) {
        db.collection('allergen').orderBy('code', 'desc').get().then(allergen => {

            if (allergen.filter(function(e) { return e.code === allergenTypeCode; }).length > 0) {
                hasAlert = true;
                hasAlertNOTOK = true;
                document.getElementById("alert_neg").style.opacity = 1.0;

                var allergenAlert = document.getElementById("allergenAlert");
                allergenAlert.innerHTML += `<img class="label_img label_img_BAD label_img_allergen" alt="${AllergenTypeCodes[allergenTypeCode]['fr']} - ${AllergenTypeCodes[allergenTypeCode]['nl']} -${AllergenTypeCodes[allergenTypeCode]['en']}" title="${AllergenTypeCodes[allergenTypeCode]['fr']}" src="img/allergen/${allergenTypeCode}.svg">`;
                node.innerHTML = `<img class="label_img label_img_BAD label_img_allergen" alt="${AllergenTypeCodes[allergenTypeCode]['fr']} - ${AllergenTypeCodes[allergenTypeCode]['nl']} -${AllergenTypeCodes[allergenTypeCode]['en']}" title="${AllergenTypeCodes[allergenTypeCode]['fr']}" src="img/allergen/${allergenTypeCode}.svg">`;
            } else {
                node.innerHTML = `<img class="label_img label_img_allergen" alt="${AllergenTypeCodes[allergenTypeCode]['fr']} - ${AllergenTypeCodes[allergenTypeCode]['nl']} -${AllergenTypeCodes[allergenTypeCode]['en']}" title="${AllergenTypeCodes[allergenTypeCode]['fr']}" src="img/allergen/${allergenTypeCode}.svg">`;

            }
            addToHistory();

        });
    }

}

function printCommunicationChannel(jsonObject, node) {
    var communicationChannelCode = jsonObject['code'];
    var communicationChannelValue = jsonObject['value'];
    node.innerHTML = `<img src="img/${communicationChannelCode}.svg" width="16px">&nbsp;${CommunicationChannelCodes[communicationChannelCode]} : <br><span class='data'>${communicationChannelValue}</span>`;
    node.style.opacity = 1.0;

}

function printCertificationInformation(jsonObject, node) {
    var certificationAgency = jsonObject['certificationAgency'];
    var certificationEffectiveEndDateTime = jsonObject['certificationEffectiveEndDateTime'];
    var certificationStandard = jsonObject['certificationStandard'];
    var certificationValue = jsonObject['certificationValue'];
    node.innerHTML = `<p>
    <span>Certification : ${certificationStandard}</span>
    <br>
    <span>${certificationValue}</span>
    <br>
    <span>Agence de certification : ${certificationAgency}</span>
    <br>
    <span>Depuis le ${certificationEffectiveEndDateTime}</span>
 
</p>`;
    node.style.opacity = 1.0;


}

function printImage(jsonObject, node) {
    var url = jsonObject['url'];
    node.innerHTML = `<img src="${url['@id']}"
    style="max-width: 300px;width: 100%;">`;
    node.style.opacity = 1.0;

    document.getElementById("fixedElement_referencedFiles.referencedFile.referencedFileTypeCode_PRODUCT_IMAGE").src = url['@id'];
}

function printCountriesOfOrigine(jsonObject, node) {

    var countryOfOrigin = jsonObject;
    node.innerHTML = `<img src='img/country/${countryOfOrigin}.svg' style="width: 24px;" >`;
    node.style.opacity = 1.0;

}

function printCountriesOfSale(jsonObject, node) {
    var countryOfSale = jsonObject['countryOfSale'];
    if (Array.isArray(countryOfSale)) {
        for (var l = 0; l < countryOfSale.length; l++) {
            node.innerHTML += `<img src='img/country/${countryOfSale[l]}.svg' style='width: 24px;'>&nbsp;`;

        }
    } else {
        node.innerHTML += `<img src='img/country/${countryOfSale}.svg' style='width: 24px;'>&nbsp;`;

    }
    node.style.opacity = 1.0;


}

var valeurNutri = " ENER- FAT FASAT FAMSCIS CHOAVL SUGAR- POLYL STARCH FIBTG PRO- SALTEQ NACL FAPUCIS CHOL- ";

var vitamines = " VITA- THIA RIBF NIA PANTAC VITB6- BIOT B9 FOLDFE VITB12 VITC- VITD- CHOCAL VITE- VITK VITK1 VITK2 ";

var sels = " K P MG MN FD SE FE ID CU ZN CA CLD CR NA ";


function printNutrientHeader(jsonObject, node) {

    var nutrientBasisQuantityTypeCode = jsonObject['nutrientBasisQuantityTypeCode'];
    var measurementUnitCode = jsonObject['nutrientBasisQuantity']['measurementUnitCode'];
    var nutrientBasisQuantity_content = jsonObject['nutrientBasisQuantity']['content'];
    var nutrientBasisQuantity_measurementUnitCode = MeasurementUnitCodes[jsonObject['nutrientBasisQuantity']['measurementUnitCode']];
    if ("100" == nutrientBasisQuantity_content && jsonObject['nutrientDetails']) {
        document.getElementById("nutritionalInformation.nutrientHeaders.nutrientHeader.nutrientBasisQuantity.content").innerHTML = "100";
        document.getElementById("nutritionalInformation.nutrientHeaders.nutrientHeader.nutrientBasisQuantity.measurementUnitCode").innerHTML = nutrientBasisQuantity_measurementUnitCode;
        var find = 'gr';
        var re = new RegExp(find, 'g');

        document.getElementById("portionPersoSelected").innerHTML = document.getElementById("portionPersoSelected").innerHTML.replace(re, nutrientBasisQuantity_measurementUnitCode);

        var nutrientDetails = jsonObject['nutrientDetails']['nutrientDetail'];
        var cptVitamine = 0;
        var cptSel = 0;
        var cptValeurNutri = 0;
        for (var k = 0; k < nutrientDetails.length; k++) {

            var nutrientDetail = nutrientDetails[k];
            console.log(nutrientDetail);

            var nutrientTypeCode = nutrientDetail['nutrientTypeCode'];
            if (valeurNutri.includes(" " + nutrientTypeCode + " ")) {
                cptValeurNutri++;
            }
            if (vitamines.includes(" " + nutrientTypeCode + " ")) {
                cptVitamine++;
            }
            if (sels.includes(" " + nutrientTypeCode + " ")) {
                cptSel++;
            }
            var measurementPrecisionCode = nutrientDetail['measurementPrecisionCode'];

            if ("ENER-" == nutrientTypeCode) {
                var quantityContained;
                var quantityContainedE14 = 0;
                if (Array.isArray(nutrientDetail['quantitiesContained']['quantityContained'])) {
                    var measurementUnitCode = nutrientDetail['quantitiesContained']['quantityContained'][0]['measurementUnitCode'];
                    quantityContained = nutrientDetail['quantitiesContained']['quantityContained'][0]['content'];
                    if ("E14" == measurementUnitCode) {
                        quantityContainedE14 = quantityContained;
                    }
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode).innerHTML = quantityContained;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode + "_100").innerHTML = quantityContained;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode_" + measurementUnitCode).innerHTML = MeasurementUnitCodes[measurementUnitCode];
                    measurementUnitCode = nutrientDetail['quantitiesContained']['quantityContained'][1]['measurementUnitCode'];
                    quantityContained = nutrientDetail['quantitiesContained']['quantityContained'][1]['content'];
                    if ("E14" == measurementUnitCode) {
                        quantityContainedE14 = quantityContained;
                    }
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode_" + measurementUnitCode).innerHTML = MeasurementUnitCodes[measurementUnitCode];
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode).innerHTML = quantityContained;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode).style.opacity = 1.0;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode + "_100").innerHTML = quantityContained;

                } else {
                    var measurementUnitCode = nutrientDetail['quantitiesContained']['quantityContained']['measurementUnitCode'];
                    quantityContained = nutrientDetail['quantitiesContained']['quantityContained']['content'];
                    if ("E14" == measurementUnitCode) {
                        quantityContainedE14 = quantityContained;
                    } else {
                        //quantityContainedE14 = quantityContained;
                    }
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode_" + measurementUnitCode).innerHTML = MeasurementUnitCodes[measurementUnitCode];
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode).innerHTML = quantityContained;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode).style.opacity = 1.0;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + measurementUnitCode + "_100").innerHTML = quantityContained;

                }
                if (quantityContainedE14 == 0) {
                    quantityContainedE14 = Math.round(quantityContained / 4.184);
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode_E14").innerHTML = MeasurementUnitCodes['E14'];
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14").innerHTML = quantityContainedE14;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14").style.opacity = 1.0;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14_100").innerHTML = quantityContainedE14;

                }
                if (document.getElementById("nutrientDetail_ENER-_quantityContained_KJO").innerHTML == 'n/a') {
                    var quantityContainedKJO = Math.round(quantityContainedE14 * 4.184);
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode_KJO").innerHTML = MeasurementUnitCodes['KJO'];
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_KJO").innerHTML = quantityContainedKJO;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_KJO").style.opacity = 1.0;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_KJO_100").innerHTML = quantityContainedKJO;

                }
                var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                var arInco = ARInco[nutrientTypeCode];
                arInco = arInco.split(",");
                arInco = arInco[0];
                level = quantityContainedE14 / arInco * 100;
                ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                ENER_Pourcentage.style.opacity = 1.0;
                ENER_Level.style.backgroundSize = level + "% 100%";
            } else {
                var quantityContained = nutrientDetail['quantitiesContained']['quantityContained']['content'];
                var measurementUnitCode = nutrientDetail['quantitiesContained']['quantityContained']['measurementUnitCode'];

                if (measurementPrecisionCode == "LESS_THAN") {
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").innerHTML = "<";
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").style.opacity = 1.0;
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML = "<";
                } else {
                    console.log("nutrientTypeCode : " + nutrientTypeCode);
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").innerHTML = "";
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML = "";
                };
                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").innerHTML += quantityContained;
                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").style.opacity = 1.0;
                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML += quantityContained;
                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode").innerHTML = MeasurementUnitCodes[measurementUnitCode];
                var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                ENER_Pourcentage.style.opacity = 1.0;
                var arInco = ARInco[nutrientTypeCode];


                if (arInco) {
                    arInco = arInco.split(",");
                    arInco = arInco[0];
                    level = quantityContained / arInco * 100;
                    ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                    ENER_Pourcentage.style.opacity = 1.0;
                    ENER_Level.style.backgroundSize = level + "% 100%";
                } else {
                    ENER_Level.parentNode.style.display = "none";
                }

            }

            document.getElementById("nutrientDetail_" + nutrientTypeCode).style.display = "grid";



        }
        document.getElementById("cptValeurNutri").innerHTML = cptValeurNutri;
        document.getElementById("cptVitamine").innerHTML = cptVitamine;
        document.getElementById("cptSel").innerHTML = cptSel;

    }

}

function processLanguageElems() {
    var allLanguageFlags = document.getElementsByClassName('chooseLanguageFlag');
    var foundFrBE = false;
    for (i = 0; i < allLanguageFlags.length; i++) {
        if (allLanguageFlags[i].classList.contains("fr-BE")) {
            console.log(allLanguageFlags[i].style.opacity);
            allLanguageFlags[i].classList.add("chooseLanguageFlagSelected");
            foundFrBE = true;
        }
    }
    var allLanguageDatas = document.getElementsByClassName('language');
    for (i = 0; i < allLanguageDatas.length; i++) {
        if (allLanguageDatas[i].classList.contains("fr-BE")) {
            allLanguageDatas[i].style.display = "block";
        } else {
            allLanguageDatas[i].style.display = "none";
        }
    }

}

function selectThisLanguage(flag, dataId, key) {
    var allLanguageDatas = document.getElementsByClassName(key);
    for (i = 0; i < allLanguageDatas.length; i++) {
        allLanguageDatas[i].style.display = "none";
    }
    document.getElementById(dataId).style.display = "block";

    var allLanguageFlags = document.getElementsByClassName("chooseLanguageFlag_" + key);
    for (i = 0; i < allLanguageDatas.length; i++) {
        allLanguageFlags[i].classList.remove("chooseLanguageFlagSelected");
    }
    flag.classList.add("chooseLanguageFlagSelected");
}

function showThisInformation(elem, infosElem) {
    var allInfos = document.getElementsByClassName("infos");
    for (i = 0; i < allInfos.length; i++) {
        allInfos[i].style.display = "none";
    }
    document.getElementById(infosElem).style.display = "block";
    document.getElementById("informationProvider_container").style.display = "block";

    var allbutton_informations_types = document.getElementsByClassName("button_informations_type");
    for (i = 0; i < allbutton_informations_types.length; i++) {
        allbutton_informations_types[i].classList.remove("button_informations_type_selected");
    }
    elem.classList.add("button_informations_type_selected");

}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function(item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function getJSON(gtin) {

    $.ajax({
        dataType: "json",
        url: '/01/' + gtin + '/' + gtin + '.json',
        data: jsonLD,
        success: success
    });
}
$(document).ready(function() {

    loadJsonLD();
    var rad = document.portionForm.portion;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            if (this.value == "portionPerso") {
                portionChange();
            } else {
                var portionPersoSelected = 100;;

                var quantityContained100 = document.getElementsByClassName("quantityContained100");
                for (i = 0; i < quantityContained100.length; i++) {
                    if (!quantityContained100[i].innerHTML.includes("n/a")) {
                        var value100 = quantityContained100[i].innerHTML;
                        var nutrientTypeCode = quantityContained100[i].id.split("_")[1];
                        var portion = value100 / 100 * portionPersoSelected;
                        portion = Math.round(portion * 100) / 100;
                        console.log(quantityContained100[i].id + " 100g : " + value100);
                        console.log(quantityContained100[i].id + " " + portionPersoSelected + "g : " + value100 / 100 * portionPersoSelected);
                        if (quantityContained100[i].id.includes("ENER-") && quantityContained100[i].id.includes("E14")) {
                            document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + quantityContained100[i].id.split("_")[3]).innerHTML = portion;
                            var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                            var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                            var arInco = ARInco[nutrientTypeCode];
                            if (arInco) {
                                arInco = arInco.split(",");
                                arInco = arInco[0];
                                level = portion / arInco * 100;
                                ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                                ENER_Level.style.backgroundSize = level + "% 100%";
                            } else {
                                ENER_Level.parentNode.style.display = "none";
                            }
                        } else {
                            if (!quantityContained100[i].id.includes("KJO")) {
                                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").innerHTML = portion;
                                var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                                var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                                var arInco = ARInco[nutrientTypeCode];
                                if (arInco) {
                                    arInco = arInco.split(",");
                                    arInco = arInco[0];
                                    level = portion / arInco * 100;
                                    ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                                    ENER_Level.style.backgroundSize = level + "% 100%";
                                } else {
                                    ENER_Level.parentNode.style.display = "none";
                                }
                            } else {
                                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_KJO").innerHTML = portion;

                            }
                        }
                    }

                }
                db.collection('VNRPerso').orderBy('code').get().then(VNRPerso => {

                    for (var i = 0; i < VNRPerso.length; i++) {
                        console.log(VNRPerso[i]);
                        var nutrientTypeCode = VNRPerso[i]['code'];
                        var ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
                        var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
                        var quantityContained100 = 0;
                        if (nutrientTypeCode == "ENER-") {
                            ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
                            ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
                            quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14_100").innerHTML;

                        } else {
                            quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML;
                            var find = '&lt;';
                            var re = new RegExp(find, 'g');
                            quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML.replace(re, "");
                        }
                        var arPerso = VNRPerso[i]['value'];

                        level = quantityContained100 / arPerso * 100;
                        ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                        ENER_Level.style.backgroundSize = level + "% 100%";
                        ENER_Level.parentNode.style.display = "block";
                    }
                });
            }

        });
    }
    checkFavoris();
    loadARPerso();

    setTimeout(function() {

        generateAlert();
        //computeIncoRating();
    }, 1250);

});

function computeIncoRating() {
    if (hasIncoName &&
        hasIncoConsumerStorageInstructions &&
        hasIncoIngredient &&
        hasIncoDLC &&
        hasIncoNetContent &&
        hasIncoNutrifacts &&
        hasIncoOrigin) {
        document.getElementById("ratingStarInco").innerHTML = '<img src="img/star_full.svg" style="width: 24px;fill:#3f7830"><img src="img/star_full.svg" style="width: 24px;fill:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830">';
    } else {
        document.getElementById("ratingStarInco").innerHTML = '<img src="img/star_full.svg" style="width: 24px;fill:#3f7830"><img src="img/star_empty.svg" style="width: 24px;fill:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830"><img src="img/star_empty.svg" style="width: 24px;color:#3f7830">';

    }


}

function generateAlert() {

    document.getElementById("loadingPanel").style.display = "none";

    console.log(recallAFSCAGtin);
    var recall = recallAFSCAGtin[gtin13];
    if (recall) {
        hasAlert = true;
        hasAlertNOTOK = true;

        var recallSplit = recall.split('|');
        var urlSplit = recallSplit[0].split('/');
        var date = urlSplit[7].split('_');
        date = date[0] + "-" + date[1] + "-" + date[2];
        console.log(urlSplit);
        document.getElementById("recallAFSCAGtinProblematique").innerHTML = `<h3 style="color:red">RAPPEL AFSCA du ${date}</h3>${recallSplit[3]}<br><br><a href='${recallSplit[0]}' target='_BLANK'>En savoir plus</a>`;
        document.getElementById("afscaDIV").style.display = "block";

    }
    var recall = recallDGCCRFGtin[gtin13];
    if (recall) {
        hasAlert = true;
        hasAlertNOTOK = true;
        var urlSplit = recall
        console.log(urlSplit);
        document.getElementById("recallAFSCAGtinProblematique").innerHTML += `<h3 style="color:red">RAPPEL DGCCRF </h3>Présence d’un produit chimique, l’oxyde d’éthylène, à une teneur supérieure à la limite maximum réglementaire<br><br><a href='${urlSplit}' target='_BLANK'>En savoir plus</a>`;
        document.getElementById("afscaDIV").style.display = "block";

    }
    if (hasAlert) {

        showAlertDialog();
    }

}
let killChrono = false;

function showAlertDialogFix() {
    killChrono = true;
    document.getElementById("button_cancel").innerHTML = "Fermer";
    document.getElementById("alert_gif").src = "img/alert_fix.png";
    document.getElementById("popup_content").style.backgroundImage = "url('img/alert_fix.png')";


    if (hasAlertOK) {
        document.getElementById("showAlertButton").src = "img/product_icon_alert_OK.svg";
        document.getElementById("showAlertButton").style.width = "36px";

    }
    if (hasAlertNOTOK) {
        document.getElementById("showAlertButton").src = "img/product_icon_alert_NOTOK.svg";
        document.getElementById("showAlertButton").style.width = "36px";

    }
    document.getElementById("banner_img").src = "img/logo_banner_alert.png";
    document.getElementById("banner_mobile_img").src = "img/logo_banner_alert.png";
    document.getElementById("popupAlert").style.display = "block";
    document.getElementById("alert_gif").src = "img/alert_fix.png";

    document.getElementById("popup_contentAlert").style.display = "block";


}

function showAlertDialog() {
    if (hasAlertOK) {
        document.getElementById("showAlertButton").src = "img/product_icon_alert_OK.svg";
        document.getElementById("showAlertButton").style.width = "36px";

    }
    if (hasAlertNOTOK) {
        document.getElementById("showAlertButton").src = "img/product_icon_alert_NOTOK.svg";
        document.getElementById("showAlertButton").style.width = "36px";

    }
    document.getElementById("banner_img").src = "img/logo_banner_alert.png";
    document.getElementById("banner_mobile_img").src = "img/logo_banner_alert.png";
    document.getElementById("popupAlert").style.display = "block";
    document.getElementById("alert_gif").src = "img/alert.gif?a=" + Math.random();

    setTimeout(function() {
        document.getElementById("popup_contentAlert").style.display = "block";
        for (var i = 0; i < 10; i++) {
            setTimeout(function() {
                if (!killChrono) {
                    console.log("1 second");
                    document.getElementById("chronoAlert").innerHTML = document.getElementById("chronoAlert").innerHTML - 1;
                }
            }, 1000 * i);
        }
    }, 2750);
    setTimeout(function() {
        if (!killChrono) {
            document.getElementById("popupAlert").style.display = "none";
            document.getElementById("banner_img").src = "img/logo_banner.png";
            document.getElementById("banner_mobile_img").src = "img/logo_banner.png";
        }
    }, 13000);
}

function closePopUpAlert() {
    document.getElementById("popupAlert").style.display = "none";
    document.getElementById("banner_img").src = "img/logo_banner.png";
    document.getElementById("banner_mobile_img").src = "img/logo_banner.png";

}


function loadARPerso() {
    db.collection('VNRPerso').orderBy('code').get().then(VNRPerso => {

        for (var i = 0; i < VNRPerso.length; i++) {
            console.log(VNRPerso[i]);
            var nutrientTypeCode = VNRPerso[i]['code'];
            var ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
            var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
            var quantityContained100 = 0;
            if (nutrientTypeCode == "ENER-") {
                ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
                ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14_100").innerHTML;

            } else {
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML;
                var find = '&lt;';
                var re = new RegExp(find, 'g');
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML.replace(re, "");

            }
            var arPerso = VNRPerso[i]['value'];

            level = quantityContained100 / arPerso * 100;
            ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
            ENER_Level.style.backgroundSize = level + "% 100%";
            ENER_Level.parentNode.style.display = "block";
        }
    });
    db.collection('nutrient').orderBy('code').get().then(NutrientPerso => {
        for (var i = 0; i < NutrientPerso.length; i++) {
            console.log(NutrientPerso[i]);
            NutrientPersoGlobal[NutrientPerso[i]['code']] = NutrientPerso[i]['value'];
            var nutrientTypeCode = NutrientPerso[i]['code'];
            var quantityContained100 = 0;
            var quantityContainedContainer;
            var quantityContained100Container;
            var nutrientDetail_measurementUnitCodeContainer;
            if (nutrientTypeCode == "ENER-") {
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14_100").innerHTML;
                quantityContainedContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14");
                nutrientDetail_measurementUnitCodeContainer = document.getElementById("nutrientDetail_ENER-_measurementUnitCode_E14");
            } else {
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML;
                var find = '&lt;';
                var re = new RegExp(find, 'g');
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML.replace(re, "");
                quantityContainedContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained");
                nutrientDetail_measurementUnitCodeContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode");
            }
            var nutrientPerso = NutrientPerso[i]['value'];
            if (parseFloat(quantityContained100) > parseFloat(nutrientPerso)) {
                hasAlert = true;
                hasAlertNOTOK = true;
                document.getElementById("nutrientDetail_" + NutrientPerso[i]['code'] + "_alert").innerHTML = NutrientTypeCodes[nutrientTypeCode] + " : " + quantityContained100 + nutrientDetail_measurementUnitCodeContainer.innerHTML + " &gt; " + NutrientPerso[i]['value'] + nutrientDetail_measurementUnitCodeContainer.innerHTML + "<br>";
                document.getElementById("nutrientDetail_" + NutrientPerso[i]['code'] + "_alert").style.display = 'block';

                nutrientDetail_measurementUnitCodeContainer.style.fontSize = "1.2em";
                nutrientDetail_measurementUnitCodeContainer.style.color = "red";
                quantityContainedContainer.style.color = "red";
                quantityContainedContainer.style.fontSize = "1.2em";
                document.getElementById("alert_neg").style.opacity = 1.0;
            }

        }
    });
}

function portionChange() {
    document.getElementById("portionPerso").checked = true;


    var portionPersoSelected = document.getElementById("portionPersoSelected").value;

    var quantityContained100 = document.getElementsByClassName("quantityContained100");
    for (i = 0; i < quantityContained100.length; i++) {
        if (!quantityContained100[i].innerHTML.includes("n/a")) {
            var value100 = quantityContained100[i].innerHTML;
            var nutrientTypeCode = quantityContained100[i].id.split("_")[1];
            var portion = value100 / 100 * portionPersoSelected;
            portion = Math.round(portion * 100) / 100;
            console.log(quantityContained100[i].id + " 100g : " + value100);
            console.log(quantityContained100[i].id + " " + portionPersoSelected + "g : " + value100 / 100 * portionPersoSelected);
            if (quantityContained100[i].id.includes("ENER-") && quantityContained100[i].id.includes("E14")) {
                document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_" + quantityContained100[i].id.split("_")[3]).innerHTML = portion;
                var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                var arInco = ARInco[nutrientTypeCode];
                if (arInco) {
                    arInco = arInco.split(",");
                    arInco = arInco[0];
                    level = portion / arInco * 100;
                    ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                    ENER_Level.style.backgroundSize = level + "% 100%";
                } else {
                    ENER_Level.parentNode.style.display = "none";
                }
                nutrientDetail_measurementUnitCodeContainer = document.getElementById("nutrientDetail_ENER-_measurementUnitCode_E14");
                quantityContainedContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14");
                console.log(NutrientPersoGlobal);
                console.log(portion + " > " + NutrientPersoGlobal[nutrientTypeCode]);
                if (parseFloat(portion) > parseFloat(NutrientPersoGlobal[nutrientTypeCode])) {


                    nutrientDetail_measurementUnitCodeContainer.style.fontSize = "1.2em";
                    nutrientDetail_measurementUnitCodeContainer.style.color = "red";
                    quantityContainedContainer.style.color = "red";
                    quantityContainedContainer.style.fontSize = "1.2em";
                } else {
                    nutrientDetail_measurementUnitCodeContainer.style.fontSize = "1em";
                    nutrientDetail_measurementUnitCodeContainer.style.color = "black";
                    quantityContainedContainer.style.color = "black";
                    quantityContainedContainer.style.fontSize = "1em";
                }

            } else {
                if (!quantityContained100[i].id.includes("KJO")) {
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained").innerHTML = portion;
                    var ENER_Level = document.getElementById(nutrientTypeCode + "Level");
                    var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage");
                    var arInco = ARInco[nutrientTypeCode];
                    if (arInco) {
                        arInco = arInco.split(",");
                        arInco = arInco[0];
                        level = portion / arInco * 100;
                        ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
                        ENER_Level.style.backgroundSize = level + "% 100%";
                    } else {
                        ENER_Level.parentNode.style.display = "none";
                    }
                    nutrientDetail_measurementUnitCodeContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_measurementUnitCode");
                    quantityContainedContainer = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained");

                    if (parseFloat(portion) > parseFloat(NutrientPersoGlobal[nutrientTypeCode])) {


                        nutrientDetail_measurementUnitCodeContainer.style.fontSize = "1.2em";
                        nutrientDetail_measurementUnitCodeContainer.style.color = "red";
                        quantityContainedContainer.style.color = "red";
                        quantityContainedContainer.style.fontSize = "1.2em";
                    } else {
                        nutrientDetail_measurementUnitCodeContainer.style.fontSize = "1em";
                        nutrientDetail_measurementUnitCodeContainer.style.color = "black";
                        quantityContainedContainer.style.color = "black";
                        quantityContainedContainer.style.fontSize = "1em";
                    }
                } else {
                    document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_KJO").innerHTML = portion;

                }
            }
        }

    }
    db.collection('VNRPerso').orderBy('code').get().then(VNRPerso => {

        for (var i = 0; i < VNRPerso.length; i++) {
            console.log(VNRPerso[i]);
            var nutrientTypeCode = VNRPerso[i]['code'];
            var ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
            var ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
            var quantityContained100 = 0;
            if (nutrientTypeCode == "ENER-") {
                ENER_Level = document.getElementById(nutrientTypeCode + "Level_best");
                ENER_Pourcentage = document.getElementById(nutrientTypeCode + "Pourcentage_best");
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained_E14_100").innerHTML;

            } else {
                quantityContained100 = document.getElementById("nutrientDetail_" + nutrientTypeCode + "_quantityContained100").innerHTML;

            }
            var arPerso = VNRPerso[i]['value'];

            level = (quantityContained100 / 100 * portionPersoSelected) / arPerso * 100;
            ENER_Pourcentage.innerHTML = (Math.round(level * 100) / 100) + "%";
            ENER_Level.style.backgroundSize = level + "% 100%";
            ENER_Level.parentNode.style.display = "block";
        }
    });


}

function closePopUp() {
    window.location.href = "rechercher.html?missingGtin=" + gtin;
}

function showMissingDialog() {

    document.getElementById("banner_img").src = "img/logo_banner_alert.png";
    document.getElementById("banner_mobile_img").src = "img/logo_banner_alert.png";
    document.getElementById("popup").style.display = "block";
    document.getElementById("alert_gif2").src = "img/alert.gif?a=" + Math.random();
    document.getElementById('resultat').innerHTML = gtin13;
    setTimeout(function() {
        document.getElementById("popup_contentAll").style.display = "block";
        for (var i = 0; i < 10; i++) {
            setTimeout(function() {
                console.log("1 second");
                document.getElementById("chronoAll").innerHTML = document.getElementById("chronoAll").innerHTML - 1;
            }, 1000 * i);
        }
    }, 2750);
    setTimeout(function() {
        window.location.href = "rechercher.html?missingGtin=" + gtin;

    }, 13000);
}