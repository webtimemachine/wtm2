import { refreshTokenData } from './auth.js';
import { API_URL } from './consts.js';

/**
 * Asynchronous function to save a navigation history entry for a user by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {object} payload - An object containing the data to be saved as a history entry.
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

    if (resp.status === 401) {
      throw Error('accessToken expired!')
    }

    return resp
  } catch (err) {
    console.error(err);
    if (reexecuted) return
    return await refreshTokenData({ user_info }).then(async (res) => await saveHistoryEntry({ ...user_info, ...res }, payload, true))
  }
}

/**
 * Asynchronous function to retrieve navigation history entries for a user with pagination support by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {number} offset - The offset for pagination, specifying the starting index of the entries to retrieve.
 * @param {number} limit - The limit for pagination, specifying the maximum number of entries to retrieve.
 * @returns {Promise<object>} A Promise that resolves to an object containing the navigation history entries.
 */
export async function getHistoryEntries (user_info, offset, limit, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history with pagination parameters
    const resp = await fetch(`${API_URL}/api/navigation-entry?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    })

    if (resp.status === 401) {
      throw Error('accessToken expired!')
    }
    // Parse the response body as JSON
    const response = await resp.json()
    // Return the parsed response
    return response
  } catch (err) {
    console.error(err);
    if (reexecuted) return
    return await refreshTokenData({ user_info }).then(async (res) => await getHistoryEntries({ ...user_info, ...res }, offset, limit, true))
  }
}
