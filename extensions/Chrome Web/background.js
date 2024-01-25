let historyArray = [];

chrome.runtime.onStartup.addListener(function () {
  // Here is where we have to auth the user
})


/*function sendDataToServer(data) {
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
*/

/**
 * Return html content from a HTMLElement
 * 
 * @param {string} selector 
 * @returns {string}
 */
function DOMtoString (selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node"
  } else {
    selector = document.documentElement.outerHTML;
  }

  return selector.outerHTML;
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url && !tab.url?.startsWith("chrome://")) {
      let htmlContent = ''

      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: DOMtoString,
        args: ['body']
      })

      if (results.length) {
        htmlContent = results[0].result
      }

      const record = {
        url: tab.url,
        time: new Date().getTime(),
        title: tab.title,
        content: htmlContent
      }

      historyArray.push(record);
      // Example of sending the history array
      //sendDataToServer(historyArray);
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "getHistory") {
    sendResponse({ history: historyArray });
  }
});
