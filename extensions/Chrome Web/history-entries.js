import { refreshTokenData } from './auth.js';
import { API_URL } from './consts.js';

/**
 * Asynchronous function to save a navigation history entry for a user by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {object} payload - An object containing the data to be saved as a history entry.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<Response>} A Promise that resolves to the response from the history entry save request.
 */
export async function saveHistoryEntry (user_info, payload, reexecuted = false) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload)

    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${API_URL}/api/navigation-entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      },
      body: body
    })
    // Check if the access token has expired (HTTP status code 401)
    if (resp.status === 401) {
      throw Error('accessToken expired!')
    }

    return resp
  } catch (err) {
    console.error(err);
    // If the function is being re-executed after refreshing the access token, return without re-executing refreshTokenData to prevent an infinite loop
    if (reexecuted) return
    // Refresh the access token and re-execute saveHistoryEntry
    return await refreshTokenData({ user_info }).then(async (res) => await saveHistoryEntry({ ...user_info, ...res }, payload, true))
  }
}

/**
 * Asynchronous function to retrieve navigation history entries for a user with pagination support and optional query parameter by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {number} offset - The offset for pagination, specifying the starting index of the entries to retrieve.
 * @param {number} limit - The limit for pagination, specifying the maximum number of entries to retrieve.
 * @param {string} [query] - An optional query string for filtering history entries.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<object>} A Promise that resolves to an object containing the navigation history entries.
 */
export async function getHistoryEntries (user_info, offset, limit, query, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history with pagination parameters
    const resp = await fetch(`${API_URL}/api/navigation-entry?offset=${offset}&limit=${limit}${query ? `&query=${query}` : ''}`, {
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
    if (reexecuted) return
    // Refresh the access token and re-execute getHistoryEntries
    return await refreshTokenData({ user_info }).then(async (res) => await getHistoryEntries({ ...user_info, ...res }, offset, limit, query, true))
  }
}
