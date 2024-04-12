import { refreshTokenData } from '../auth.js';

export async function getUserActiveSessions (user_info, baseURL, reexecuted = false) {
  try {
    // Send a GET request to the endpoint for retrieving all user active sessions
    const resp = await fetch(`${baseURL}/api/auth/session`, {
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
    // Refresh the access token and re-execute getUserActiveSessions
    return await refreshTokenData({ user_info }, baseURL).then(async (res) => await getUserActiveSessions({ ...user_info, ...res }, baseURL, true))
  }
}