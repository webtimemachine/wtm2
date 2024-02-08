import { loginUser, logoutUser, is_user_signed_in, refreshUser, getDeviceId } from './auth.js'
import { saveHistoryEntry, getHistoryEntries } from './history-entries.js'



chrome.runtime.onStartup.addListener(function () {
  // Here is where we have to refresh the user authentication

  is_user_signed_in(chrome).then((res) => {
    if (res.userStatus) {
      refreshUser(res)
        .then(async response => await response.json())
        .then(async () => {
          return await new Promise((resolve, reject) => {
            if (!response.user) reject('fail');

            chrome.storage.local.set({ userStatus: true, user_info: { ...data.user_info, ...response } },
              function () {
                if (chrome.runtime.lastError) reject('fail');
                resolve(response);
              });
          });
        })
    }
  })
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
        navigationDate: new Date().toISOString(),
        title: tab.title,
        content: htmlContent.substring(0, 1000) //TODO: FIX CONTENT SIZE
      }

      is_user_signed_in(chrome).then((data) => {
        if (data.userStatus) {
          saveHistoryEntry(data.user_info, record)
        }
      })
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "getHistory") {
    is_user_signed_in(chrome).then((data) => {
      if (data.userStatus) {
        getHistoryEntries(data.user_info, request.offset, request.limit).then((res) => sendResponse(res))
      }
    })
    return true;
  }


  if (request.type === 'login') {
    getDeviceId()
      .then((deviceId) =>
        loginUser(request.payload, deviceId)
          .then(async response => await response.json())
          .then(async (response) => {
            return await new Promise((resolve, reject) => {
              if (!response.user) reject('fail');
              chrome.storage.local.set({ userStatus: true, user_info: response, device_id: deviceId },
                function () {
                  if (chrome.runtime.lastError) reject('fail');
                  resolve(response);
                });
            });
          })
          .then(res => {
            sendResponse(res)
          })
          .catch(err => console.log(err)))

    return true;
  }

  if (request.type === 'logout') {
    logoutUser()
      .then(res => sendResponse(res))
      .catch(err => console.log(err));
    return true;
  }
});