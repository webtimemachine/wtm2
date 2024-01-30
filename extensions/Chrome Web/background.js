import { loginUser } from './auth.js'

let historyArray = [];

chrome.runtime.onStartup.addListener(function () {
  // Here is where we have to auth the user
})

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
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "getHistory") {
    sendResponse({ history: historyArray });
  }


  if (request.type === 'login') {
    loginUser(request.payload)
      .then(res => {
        console.log('res', res);
        sendResponse(res)
      })
      .catch(err => console.log(err));
    return true;
  }
});