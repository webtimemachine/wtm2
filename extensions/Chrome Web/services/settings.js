import { refreshTokenData } from '../auth.js';

/**
 * Asynchronous function to get the user's preferences by sending a request to the server.
 *
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {object} baseURL - An string containing the server's base url.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<Response>} A Promise that resolves to the response from the get user's preferences request.
 */
export async function getUserPreferencies (user_info, baseURL, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history with pagination parameters
    const resp = await fetch(`${baseURL}/api/user/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    })
    // Check if the access token has expired (HTTP status code 401)
    if (resp.status === 401) {
      throw Error('accessToken expired!')
    }
    // Parse the response body as JSON
    const response = await resp.json()
    // Return the parsed response
    return response
  } catch (err) {
    console.error(err);
    // If the function is being re-executed after refreshing the access token, return without re-executing refreshTokenData to prevent an infinite loop
    if (reexecuted) throw Error('refreshToken expired!')
    // Refresh the access token and re-execute getUserPreferencies
    return await refreshTokenData({ user_info }).then(async (res) => await getUserPreferencies({ ...user_info, ...res }, baseURL, true))
  }
}

/**
 * Asynchronous function to update the user's preferences by sending a request to the server.
 *
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {object} baseURL - An string containing the server's base url.
 * @param {object} payload - An object containing the data to be saved as a user preferences.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<Response>} A Promise that resolves to the response from the update user's preferences request.
 */
export async function updatePreferences (
  user_info,
  baseURL,
  payload,
  reexecuted = false,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${baseURL}/api/user/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user_info.accessToken}`,
      },
      body: body,
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
    // Refresh the access token and re-execute updatePreferences
    return await refreshTokenData({ user_info }).then(
      async (res) =>
        await updatePreferences(
          { ...user_info, ...res },
          baseURL,
          payload,
          true,
        ),
    );
  }
}