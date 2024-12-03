function activateMenuItem() {

}

let db = new Localbase('db');


var ctpRecall = 0;
$(document).ready(function() {

    loadFavoris();
    loadHistory();

});
var nbrHistory = 0;
var nbrFavoris = 0;
var workers = new Array();
var continueLoading = true;
async function loadFavoris() {
    await db.collection('favoris').orderBy('last_consult', 'desc').get().then(favoris => {

        for (var i = 0; i < favoris.length && i < 22; i++) {
            nbrFavoris++;
            var monWorker = new Worker('js/worker/indexWorker.js');

            var gtin = favoris[i]['gtin'];

            $.ajax({
                url: 'offers_published_light/' + gtin + '.html',
                indexValue: i,
                gtin: gtin,
                type: 'GET',
                //HAS OFFER
                success: function(htmlOffer) {
                    var bioplanetOffer = "";
                    var colruytOffer = "";
                    var carrefourOffer = "";
                    if (htmlOffer.indexOf("offerDate_bioplanet'>") > -1) {
                        bioplanetOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_bioplanet'>"), htmlOffer.length);
                        bioplanetOffer = "<img src='img/logo_bioplanet.png' height='10px'></img><br>" + bioplanetOffer.substr(0, bioplanetOffer.indexOf("</span></div>") + "</span>".length);

                    }

                    if (htmlOffer.indexOf("offerDate_carrefour'>") > -1) {

                        carrefourOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_carrefour'>"), htmlOffer.length);
                        carrefourOffer = "<img src='img/logo_carrefour.png' height='10px'></img><br>" + carrefourOffer.substr(0, carrefourOffer.indexOf("</span></div>") + "</span>".length);
                    }

                    if (htmlOffer.indexOf("offerDate_colruyt'>") > -1) {
                        colruytOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_colruyt'>"), htmlOffer.length);
                        colruytOffer = "<img src='img/logo_colruyt.png' height='10px'></img><br>" + colruytOffer.substr(0, colruytOffer.indexOf("</span></div>") + "</span>".length);

                    }

                    monWorker.postMessage([favoris[this.indexValue], recallAFSCAGtin, recallDGCCRFGtin, colruytOffer, carrefourOffer, bioplanetOffer]);
                    console.log('Message envoyé au worker');
                    monWorker.onmessage = function(e) {
                        resultat = e.data;

                        var favoris_container = document.getElementById("favoris_container");
                        favoris_container.innerHTML += resultat;
                        favoris_container.style.display = "grid";
                        if (!continueLoading && workers) {
                            for (var j = 0; j < workers.length; j++) {
                                workers[j].terminate();
                            }
                        }
                        var allCardLink = document.getElementsByClassName("product_card");
                        for (var k = 0; k < allCardLink.length; k++) {
                            console.log("card-link");
                            allCardLink[k].onclick = function() {
                                continueLoading = false;
                                for (var l = 0; l < workers.length; l++) {
                                    workers[l].terminate();
                                }
                            };
                        }
                    }

                },
                //HAS NO  OFFER
                error: function(data) {
                    monWorker.postMessage([favoris[this.indexValue], recallAFSCAGtin, recallDGCCRFGtin, "", "", ""]);
                    console.log('Message envoyé au worker');
                    monWorker.onmessage = function(e) {
                        resultat = e.data;

                        var favoris_container = document.getElementById("favoris_container");
                        favoris_container.innerHTML += resultat;
                        favoris_container.style.display = "grid";
                        if (!continueLoading && workers) {
                            for (var j = 0; j < workers.length; j++) {
                                workers[j].terminate();
                            }
                        }
                        var allCardLink = document.getElementsByClassName("product_card");
                        for (var k = 0; k < allCardLink.length; k++) {
                            console.log("card-link");
                            allCardLink[k].onclick = function() {
                                continueLoading = false;
                                for (var l = 0; l < workers.length; l++) {
                                    workers[l].terminate();
                                }
                            };
                        }
                    }
                }
            });


            workers.push(monWorker);
        }
    })
    document.getElementById("loadingPanel").style.display = "none";

}
async function loadHistory() {
    await db.collection('historique').orderBy('last_consult', 'desc').get().then(favoris => {
        for (var i = 0; i < favoris.length && i < 22; i++) {
            nbrHistory++;
            var monWorker = new Worker('js/worker/indexWorker.js');
            var gtin = favoris[i]['gtin'];



            $.ajax({
                url: 'offers_published_light/' + gtin + '.html',
                indexValue: i,
                gtin: gtin,
                type: 'GET',
                //HAS OFFER
                success: function(htmlOffer) {
                    var bioplanetOffer = "";
                    var colruytOffer = "";
                    var carrefourOffer = "";
                    if (htmlOffer.indexOf("offerDate_bioplanet'>") > -1) {
                        bioplanetOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_bioplanet'>"), htmlOffer.length);
                        bioplanetOffer = "<img src='img/logo_bioplanet.png' height='10px'></img><br>" + bioplanetOffer.substr(0, bioplanetOffer.indexOf("</span></div>") + "</span>".length);

                    }

                    if (htmlOffer.indexOf("offerDate_carrefour'>") > -1) {

                        carrefourOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_carrefour'>"), htmlOffer.length);
                        carrefourOffer = "<img src='img/logo_carrefour.png' height='10px'></img><br>" + carrefourOffer.substr(0, carrefourOffer.indexOf("</span></div>") + "</span>".length);
                    }

                    if (htmlOffer.indexOf("offerDate_colruyt'>") > -1) {
                        colruytOffer = htmlOffer.substr(htmlOffer.indexOf("<span class='offerDate offerDate_colruyt'>"), htmlOffer.length);
                        colruytOffer = "<img src='img/logo_colruyt.png' height='10px'></img><br>" + colruytOffer.substr(0, colruytOffer.indexOf("</span></div>") + "</span>".length);

                    }

                    monWorker.postMessage([favoris[this.indexValue], recallAFSCAGtin, recallDGCCRFGtin, colruytOffer, carrefourOffer, bioplanetOffer]);
                    console.log('Message envoyé au worker HISTORY');
                    monWorker.onmessage = function(e) {
                        resultat = e.data;

                        var favoris_container = document.getElementById("historique_container");
                        favoris_container.innerHTML += resultat;
                        favoris_container.style.display = "grid";
                        if (!continueLoading && workers) {
                            for (var j = 0; j < workers.length; j++) {
                                workers[j].terminate();
                            }
                        }
                        var allCardLink = document.getElementsByClassName("product_card");
                        for (var k = 0; k < allCardLink.length; k++) {
                            console.log("card-link HISTORY");
                            allCardLink[k].onclick = function() {
                                continueLoading = false;
                                for (var l = 0; l < workers.length; l++) {
                                    workers[l].terminate();
                                }
                            };
                        }
                    }

                },
                //HAS NO  OFFER
                error: function(data) {
                    monWorker.postMessage([favoris[this.indexValue], recallAFSCAGtin, recallDGCCRFGtin, "", "", ""]);
                    console.log('Message envoyé au worker HISTORY');
                    monWorker.onmessage = function(e) {
                        resultat = e.data;
                        console.log('Message reçu depuis le worker HISTORY');

                        var favoris_container = document.getElementById("historique_container");
                        favoris_container.innerHTML += resultat;
                        favoris_container.style.display = "grid";
                        if (!continueLoading && workers) {
                            for (var j = 0; j < workers.length; j++) {
                                workers[j].terminate();
                            }
                        }
                        var allCardLink = document.getElementsByClassName("product_card");
                        for (var k = 0; k < allCardLink.length; k++) {
                            console.log("card-link HISTORY");
                            allCardLink[k].onclick = function() {
                                continueLoading = false;
                                for (var l = 0; l < workers.length; l++) {
                                    workers[l].terminate();
                                }
                            };
                        }
                    }
                }
            });


            workers.push(monWorker);
        }

        document.getElementById("loadingPanel").style.display = "none";
    })
}