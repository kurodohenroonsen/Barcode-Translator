chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "open-search-tab") {
      chrome.tabs.create({ url: message.url }, function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tabInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            // Extraire le contenu de la page
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                func: () => {
                  return document.body.innerHTML;
                }, // Peut être adapté pour extraire d'autres contenus
              },
              (results) => {
                if (results && results[0] && results[0].result) {
                  // Envoyer le contenu à sidepanel.js
                  chrome.runtime.sendMessage({
                    type: "analyze-search-content",
                    content: results[0].result,
                  });
                }
              }
            );
          }
        });
      });
    }
  
  });