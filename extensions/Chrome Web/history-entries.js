import { API_URL } from './consts.js';

/**
 * Asynchronous function to save a navigation history entry for a user by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {object} payload - An object containing the data to be saved as a history entry.
 * @returns {Promise<Response>} A Promise that resolves to the response from the history entry save request.
 */
export async function saveHistoryEntry (user_info, payload) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload)

    // Send a POST request to the endpoint for saving navigation history
    return await fetch(`${API_URL}/api/navigation-entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      },
      body: body
    })
  } catch (err) {
    return console.error(err);
  }
}

/**
 * Asynchronous function to retrieve navigation history entries for a user by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @returns {Promise<object>} A Promise that resolves to an object containing the navigation history entries.
 */
export async function getHistoryEntries (user_info) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history
    const resp = await fetch(`${API_URL}/api/navigation-entry`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    })
    // Parse the response body as JSON
    const response = await resp.json()
    // Return the parsed response
    return response
  } catch (err) {
    return console.error(err);
  }
}
