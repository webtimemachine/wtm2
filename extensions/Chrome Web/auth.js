import { API_URL } from './consts.js';

/**
 * Generates a random token using the crypto API.
 * The generated token is a hexadecimal string with 256 bits of randomness.
 *
 * @returns {string}
 */
export const getRandomToken = () => {
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
};

/**
 * Asynchronous function to check if a user is signed in by retrieving information from local storage.
 *
 * @param {object} chrome - The Chrome object.
 * @returns {Promise<object>} A Promise that resolves to an object containing user status and information.
 *                           The object structure: { userStatus: boolean, user_info: object }
 */
export const getStorageData = async (chrome) => {
  try {
    const response = await chrome.storage.local.get([
      'userStatus',
      'user_info',
      'device_id',
      'baseURL',
    ]);

    return response.userStatus === undefined
      ? { userStatus: false, user_info: {} }
      : response;
  } catch (error) {
    return { userStatus: false, user_info: {} };
  }
};

/**
 * Asynchronous function to retrieve the device ID from local storage.
 * If the device ID is not found in the storage, a random token is generated.
 *
 * @returns {Promise<string>}
 */
export const getDeviceId = async () => {
  // Retrieve data from local storage
  const data = await chrome.storage.local.get(['device_id']);
  // Return the device ID if found, otherwise generate a random token
  return data.device_id || getRandomToken();
};

/**
 * Asynchronous function to log in a user by sending a login request to the server.
 *
 * @param {object} payload - An object containing user credentials (email and password).
 * @param {string} deviceId - The device ID associated with the user's device.
 * @returns {Promise<Response>} A Promise that resolves to the response from the login request.
 */
export const loginUser = async (payload, deviceId) => {
  try {
    // Create the request body by converting payload to JSON
    const body = JSON.stringify({
      email: payload.email,
      password: payload.password,
      userAgent: payload.userAgent,
      deviceKey: deviceId,
    });

    // Send a POST request to the login endpoint with the provided body
    return await fetch(`${payload.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (err) {
    return console.error(err);
  }
};

/**
 * Asynchronous function to refresh a user's authentication token by sending a request to the server.
 *
 * @param {object} data - An object containing user information, including the refresh token.
 * @returns {Promise<Response>} A Promise that resolves to the response from the token refresh request.
 */
export const refreshUser = async (data) => {
  try {
    // Send a GET request to the refresh endpoint with the user's refresh token in the Authorization header
    return await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.user_info?.refreshToken}`,
      },
    });
  } catch (err) {
    return console.error(err);
  }
};

export const logoutUser = async () => {
  return await chrome.storage.local.set({ userStatus: false, user_info: {} });
};

export const refreshTokenData = async (res) => {
  try {
    const response = await refreshUser(res);
    const data = await response.json();

    await chrome.storage.local.set({
      userStatus: true,
      user_info: { ...res.user_info, ...data },
    });

    return data;
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

/**
 * Asynchronous function to create an account for a user by sending a sign up request to the server.
 *
 * @param {object} payload - An object containing user credentials for the new user (email and password).
 * @returns {Promise<Response>} A Promise that resolves to the response from the sign up request.
 */
export const signUpUser = async (payload) => {
  try {
    // Create the request body by converting payload to JSON
    const body = JSON.stringify({
      email: payload.email,
      password: payload.password,
    });

    // Send a POST request to the sign up endpoint with the provided body
    return await fetch(`${payload.baseURL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Asynchronous function to delete an account for a user by sending a delete request to the server.
 *
 * @returns {Promise<Response>} A Promise that resolves to the response from the sign up request.
 */
export async function deleteUserAccount (
  user_info,
  baseURL,
  reexecuted = false,
) {
  try {
    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${baseURL}/api/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user_info.accessToken}`,
      }
    });
    // Check if the access token has expired (HTTP status code 401)
    if (resp.status === 401) {
      throw Error('accessToken expired!');
    }

    return resp;
  } catch (err) {
    console.error(err);
    // If the function is being re-executed after refreshing the access token, return without re-executing refreshTokenData to prevent an infinite loop
    if (reexecuted) throw Error('refreshToken expired!');
    // Refresh the access token and re-execute deleteUserAccount
    return await refreshTokenData({ user_info }).then(
      async (res) =>
        await deleteUserAccount(
          { ...user_info, ...res },
          baseURL,
          true,
        ),
    );
  }
}