/**
 * Asynchronous function to start the recovery passoword flow by sending a request to the server.
 *
 * @param {string} baseURL - An string containing the server's base url.
 * @param {object} payload - An object containing the user email.
 * @returns {Promise<Response>} A Promise that resolves to the response from the update user's preferences request.
 */
export async function initiateRecoveryPassword (
  baseURL,
  payload,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${baseURL}/api/auth/password-recovery/initiate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    // Check if the access token has expired (HTTP status code 401)
    if (resp.status !== 200) {
      throw Error('Error!');
    }

    return resp;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Asynchronous function to verify if the code and email are valid by sending a request to the server.
 *
 * @param {string} baseURL - An string containing the server's base url.
 * @param {object} payload - An object containing the data to be verify (email & code).
 * @returns {Promise<Response>} A Promise that resolves to the response from the update user's preferences request.
 */
export async function validateRecoveryEmailWithCode (
  baseURL,
  payload,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${baseURL}/api/auth/password-recovery/validate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    // Check if the access token has expired (HTTP status code 401)
    if (resp.status !== 200) {
      throw Error('Error!');
    }

    return resp;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Asynchronous function to update the user's preferences by sending a request to the server.
 *
 * @param {string} recoveryToken - An string with the recovery token.
 * @param {string} baseURL - An string containing the server's base url.
 * @param {object} payload - An object containing the data to finish the process.
 * @returns {Promise<Response>} A Promise that resolves to the response from the update user's preferences request.
 */
export async function completeRecoveryPassword (
  recoveryToken,
  baseURL,
  payload,
) {
  try {
    // Convert payload to JSON for the request body
    const body = JSON.stringify(payload);

    // Send a POST request to the endpoint for saving navigation history
    const resp = await fetch(`${baseURL}/api/auth/password-recovery/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recoveryToken}`,
      },
      body: body,
    });
    // Check if the recovery token has expired (HTTP status code 401)
    if (resp.status === 401) {
      throw Error('recoveryToken expired!');
    }

    return resp;
  } catch (err) {
    console.error(err);
  }
}