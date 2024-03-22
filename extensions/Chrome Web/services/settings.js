import { refreshTokenData } from './auth.js';
import { API_URL } from './consts.js';

/**
 * Asynchronous function to retrieve navigation history entries for a user with pagination support and optional query parameter by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<object>} A Promise that resolves to an object containing the navigation history entries.
 */
export async function getUserPreferencies (user_info, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history with pagination parameters
    const resp = await fetch(`${API_URL}/api/user/preferences`, {
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
    return { ...response }
  } catch (err) {
    console.error(err);
    // If the function is being re-executed after refreshing the access token, return without re-executing refreshTokenData to prevent an infinite loop
    if (reexecuted) throw Error('refreshToken expired!')
    // Refresh the access token and re-execute getHistoryEntries
    return await refreshTokenData({ user_info }).then(async (res) => await getUserPreferencies({ ...user_info, ...res }, true))
  }
}
