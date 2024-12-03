let db = new Localbase('db');

function activateMenuItem() {
    document.getElementById("nav-link_historique").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_historique").classList.add("nav-link_actif");
}

$(document).ready(function() {

    loadHistorique();
    document.getElementById("loadingPanel").style.display = "none";


});
var workers = new Array();
var continueLoading = true;
async function loadHistorique() {
    await db.collection('historique').orderBy('last_consult', 'desc').get().then(favoris => {
        for (var i = 0; i < favoris.length && continueLoading; i++) {
            var monWorker = new Worker('js/worker/favorisWorkerOffer.js');
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
                        // console.log('Message reçu depuis le worker' + resultat);

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
                            console.log("card-link");
                            allCardLink[k].onclick = function() {
                                continueLoading = false;
                                for (var l = 0; l < workers.length; l++) {
                                    workers[l].terminate();
                                }
                            };
                        }
                    }

                    console.log(gtin + " HAS bioplanetOffer : " + bioplanetOffer);
                    console.log(gtin + " HAS carrefourOffer : " + carrefourOffer);
                    console.log(gtin + " HAS colruytOffer : " + colruytOffer);
                },
                //HAS NO  OFFER
                error: function(data) {
                    monWorker.postMessage([favoris[this.indexValue], recallAFSCAGtin, recallDGCCRFGtin, "", "", ""]);
                    console.log('Message envoyé au worker');
                    monWorker.onmessage = function(e) {
                        resultat = e.data;
                        console.log('Message reçu depuis le worker' + resultat);

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
        document.getElementById("loadingPanel").style.display = "none";

    })
}

function cleRelachee(evt) {
    var filtre = document.getElementById('filtre').value;
    filtre = filtre.toUpperCase();
    var elements = document.getElementsByClassName("product_card");
    if (filtre.length > 1) {
        for (i = 0; i < elements.length; i++) {
            if (!elements[i].innerHTML.toUpperCase().includes(filtre)) {
                elements[i].style.display = "none";
            } else {
                elements[i].style.display = "block";
            }
        }
    } else {
        for (i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
    }
}

function killWorkers() {
    continueLoading = false;
    console.log("killWorkers");
    if (workers) {
        for (var j = 0; j < workers.length; j++) {
            workers[j].terminate();
        }
    }
}