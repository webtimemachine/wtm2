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


export async function logoutSessionBySessionId (
  user_info,
  baseURL,
  payload,
  reexecuted = false,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a POST request to the endpoint for logout sessions
    const resp = await fetch(`${baseURL}/api/auth/session/logout`, {
      method: 'POST',
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
    // Refresh the access token and re-execute logoutSessionBySessionId
    return await refreshTokenData({ user_info }, baseURL).then(
      async (res) =>
        await logoutSessionBySessionId(
          { ...user_info, ...res },
          baseURL,
          payload,
          true,
        ),
    );
  }
}

export async function updateDeviceAlias (
  user_info,
  baseURL,
  payload,
  deviceId,
  reexecuted = false,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a PUT request to the endpoint for update the device alias
    const resp = await fetch(`${baseURL}/api/user/device/${deviceId}`, {
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
    // Refresh the access token and re-execute updateDeviceAlias
    return await refreshTokenData({ user_info }, baseURL).then(
      async (res) =>
        await updateDeviceAlias(
          { ...user_info, ...res },
          baseURL,
          payload,
          deviceId,
          true,
        ),
    );
  }
}