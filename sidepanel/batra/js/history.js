function searchGtin() {
    window.location = "productFull.html?gtin=" + document.getElementById("gtinSearch").value;
  }
  function loadHistory() {


    db.collection('app_history').get().then(products => {
      if (products.length > 0) {
        for (let i = products.length - 1; i > -1; i--) {

          addHistoryToList(products[i]["jsonData"]);
        }
      }


    });
  };
  function removeHistory(gtin) {
    db.collection('app_history').doc({ id: gtin }).delete()
    document.getElementById("content").innerHTML = '';
    setTimeout(loadHistory, 500);


  }
  var workers = new Array();
  var continueLoading = true;
  function addHistoryToList(producJson) {
    var monWorker = new Worker('js/favorisWorker.js');
    workers.push(monWorker);
    monWorker.postMessage([producJson]);
    console.log('Message envoyé au worker');
    monWorker.onmessage = function (e) {
      resultat = e.data;
      // console.log('Message reçu depuis le worker' + resultat);

      var favoris_container = document.getElementById("content");
      favoris_container.innerHTML += resultat;
      var productFulls = document.getElementsByClassName('productFull');
      for (let index = 0; index < productFulls.length; index++) {
          const element = productFulls[index];
          element.addEventListener('click', async (event) => {
              window.location=`productFull.html?gtin=${element.getAttribute('data')}`;
          });
      
      }
      var removeFavorys = document.getElementsByClassName('product_card_buttonDel');
      for (let index = 0; index < removeFavorys.length; index++) {
          const element = removeFavorys[index];
          element.addEventListener('click', async (event) => {
            removeHistory(element.getAttribute('data'));
          });
      
      }
      if (!continueLoading && workers) {
        for (var j = 0; j < workers.length; j++) {
          workers[j].terminate();
        }
      }
      
    }
    
  }
  let db = new Localbase('db_batra_link');
  loadHistory();

  $("a[href='#top']").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });