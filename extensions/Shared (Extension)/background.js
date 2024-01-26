let historyArray = [];
function sendDataToServer(data) {
  fetch('http://127.0.0.1:5000/saveHistory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        if (tab.url) {
            historyArray.push(tab.url);
            // Example of sending the history array
            sendDataToServer(historyArray);
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getHistory") {
        sendResponse({ history: historyArray });
    }
});
