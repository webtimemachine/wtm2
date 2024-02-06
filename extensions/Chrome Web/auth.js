import { API_URL } from './consts.js';

/**
 * Generates a random token using the crypto API.
 * The generated token is a hexadecimal string with 256 bits of randomness.
 * 
 * @returns {string}
 */
export function getRandomToken () {
  // E.g. 8 * 32 = 256 bits token
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  // Convert the random values to a hexadecimal string
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}

/**
 * Asynchronous function to check if a user is signed in by retrieving information from local storage.
 * 
 * @param {object} chrome - The Chrome object.
 * @returns {Promise<object>} A Promise that resolves to an object containing user status and information.
 *                           The object structure: { userStatus: boolean, user_info: object }
 */
export function is_user_signed_in (chrome) {
  return new Promise(resolve => {
    chrome.storage.local.get(['userStatus', 'user_info', 'device_id'],
      function (response) {
        if (chrome.runtime.lastError) resolve({
          userStatus:
            false, user_info: {}
        })
        resolve(response.userStatus === undefined ?
          { userStatus: false, user_info: {} } : response
        )
      });
  });
}

/**
 * Asynchronous function to retrieve the device ID from local storage.
 * If the device ID is not found in the storage, a random token is generated.
 * 
 * @returns {Promise<string>}
 */
export async function getDeviceId () {
  // Retrieve data from local storage
  const data = await chrome.storage.local.get(['device_id'])
  // Return the device ID if found, otherwise generate a random token
  return data.device_id || getRandomToken()
}

export async function loginUser (payload) {
  try {
    const deviceId = await getDeviceId()

    const body = JSON.stringify({
      email: payload.email,
      password: payload.password,
      deviceId
    })

    const resp = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })

    const response = await resp.json()

    return await new Promise((resolve, reject) => {
      if (!response.user) reject('fail');

      chrome.storage.local.set({ userStatus: true, user_info: response, device_id: deviceId },
        function () {
          if (chrome.runtime.lastError) reject('fail');
          resolve(response);
        });
    });
  } catch (err) {
    return console.log(err);
  }
}

export async function refreshUser (data) {
  try {

    const resp = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.user_info.refreshToken}`
      }
    })

    const response = await resp.json()

    return await new Promise((resolve, reject) => {
      if (!response.user) reject('fail');

      chrome.storage.local.set({ userStatus: true, user_info: { ...data.user_info, ...response } },
        function () {
          if (chrome.runtime.lastError) reject('fail');
          resolve(response);
        });
    });
  } catch (err) {
    reject('fail');
    return console.log(err);
  }
}

export async function logoutUser () {
  chrome.storage.local.set({ userStatus: false, user_info: {} });
}
