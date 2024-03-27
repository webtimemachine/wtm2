import { refreshTokenData } from './auth.js';

/**
 * Asynchronous function to retrieve query entries for a user with pagination support and optional query parameter by sending a request to the server.
 * 
 * @param {object} user_info - An object containing user information, including the access token.
 * @param {string} baseURL - Base server URL.
 * @param {number} offset - The offset for pagination, specifying the starting index of the entries to retrieve.
 * @param {number} limit - The limit for pagination, specifying the maximum number of entries to retrieve.
 * @param {string} [query] - An optional query string for filtering history entries.
 * @param {boolean} [reexecuted=false] - An optional flag indicating whether the function is being re-executed after refreshing the access token.
 * @returns {Promise<object>} A Promise that resolves to an object containing the queries and their corresponding navigation entries.
 */
export async function getQueryEntries(user_info, baseURL, offset, limit, query, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving navigation history with pagination parameters
    const resp = await fetch(`${baseURL}/api/queries?offset=${offset}&limit=${limit}${query ? `&query=${query}` : ''}`, {
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
    return { ...response, user: user_info.user.email }
  } catch (err) {
    console.error(err);
    // If the function is being re-executed after refreshing the access token, return without re-executing refreshTokenData to prevent an infinite loop
    if (reexecuted) throw Error('refreshToken expired!')
    // Refresh the access token and re-execute getQueryEntries
    return await refreshTokenData({ user_info }).then(async (res) => await getQueryEntries({ ...user_info, ...res }, baseURL, offset, limit, true))
  }
}
