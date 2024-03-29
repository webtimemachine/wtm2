import {
  loginUser,
  logoutUser,
  getStorageData,
  getDeviceId,
  signUpUser,
  deleteUserAccount,
} from './auth.js';

import { getHistoryEntries, deleteHistoryEntries } from './history-entries.js';
import { getUserPreferencies, updatePreferences } from './services/settings.js';

/**
 * Handles the request to fetch browsing history entries.
 *
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Object} request - Object containing parameters for fetching history entries.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>} - A Promise that resolves once the history entries are fetched and sent.
 */
export const handleGetHistory = async (chrome, request, sendResponse) => {
  // Check if the user is signed in
  const storageData = await getStorageData(chrome);
  if (storageData.userStatus) {
    try {
      const baseURL = storageData.baseURL || API_URL;

      // Fetch browsing history entries
      const res = await getHistoryEntries(
        storageData.user_info,
        baseURL,
        request.offset,
        request.limit,
        request.search,
      );
      // Send the fetched history entries back as a response
      sendResponse(res);
    } catch (error) {
      // If an error occurs during fetching, send an error response
      sendResponse({ error: true });
    }
  }
};

/**
 * Handles the user login request.
 *
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Object} request - Object containing the login request payload.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>} - A Promise that resolves once the login operation is completed.
 */
export const handleLogin = async (chrome, request, sendResponse) => {
  // Obtain the device ID
  const deviceId = await getDeviceId();

  try {
    // Send login request with user payload and device ID
    const response = await loginUser(request.payload, deviceId);
    // Parse login response as JSON
    const loginRes = await response.json();

    // If login response doesn't contain user information, throw an error
    if (!loginRes.user) throw Error('login error');

    // Store user status, user information, and device ID in local storage
    await chrome.storage.local.set({
      userStatus: true,
      user_info: loginRes,
      device_id: deviceId,
      baseURL: request.payload.baseURL,
    });

    // Send login response back to the caller
    sendResponse(loginRes);
  } catch (error) {
    // If an error occurs during login, send an error response
    sendResponse({ error: true });
  }
};

/**
 * Handles the user logout request.
 *
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>} - A Promise that resolves once the logout operation is completed.
 */
export const handleLogout = async (sendResponse) => {
  try {
    // Call the logout user function
    const res = await logoutUser();
    // Send response back to the caller
    sendResponse(res);
  } catch (error) {
    // If an error occurs during logout, log the error
    console.log(error);
  }
};

/**
 * Handles the request to delete a history entry.
 *
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Object} request - Object containing the request details.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>} - A Promise that resolves once the history entry is deleted and new history entries are fetched.
 */
export const handleDeleteHistoryEntry = async (
  chrome,
  request,
  sendResponse,
) => {
  // Check if the user is signed in
  const storageData = await getStorageData(chrome);
  if (storageData.userStatus) {
    const baseURL = storageData.baseURL || API_URL;

    const payload = {
      id: request.item.id,
    };

    try {
      // Delete the history entry
      await deleteHistoryEntries(storageData.user_info, baseURL, payload);
      // Fetch new history entries after deletion
      const res = await getHistoryEntries(
        storageData.user_info,
        baseURL,
        request.offset,
        request.limit,
        request.search,
      );
      // Send the fetched history entries back as a response
      sendResponse(res);
    } catch (error) {
      // If an error occurs during deletion or fetching, send an error response
      sendResponse({ error: true });
    }
  }
};

/**
 * Handles the user sign up request.
 *
 * @param {Object} request - Object containing the sign up request payload.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>} - A Promise that resolves once the sign up operation is completed.
 */
export const handleSignUp = async (request, sendResponse) => {
  try {
    // Attempt to sign up the user using the provided payload
    await signUpUser(request.payload);
    // If sign up is successful, send success response
    sendResponse({ success: true });
  } catch (err) {
    // If an error occurs during sign up, send error response
    sendResponse({ error: true });
  }
};

/**
 * Retrive the user's preferences and send the response.
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Object} request - Object containing the request details.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>}
 */
export const handleGetPreferences = async (chrome, sendResponse) => {
  // Check if the user is signed in
  const storageData = await getStorageData(chrome);
  if (storageData.userStatus) {
    try {
      const baseURL = storageData.baseURL || API_URL;

      // Fetch browsing history entries
      const res = await getUserPreferencies(
        storageData.user_info,
        baseURL
      );
      // Send the fetched history entries back as a response
      sendResponse(res);
    } catch (error) {
      // If an error occurs during fetching, send an error response
      sendResponse({ error: true });
    }
  }
};

/**
 * Update the user's preferences and send the response.
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Object} request - Object containing the request details.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>}
 */
export const handleUpdatePreferences = async (chrome, request, sendResponse) => {
  // Check if the user is signed in
  const storageData = await getStorageData(chrome);
  if (storageData.userStatus) {
    try {
      const baseURL = storageData.baseURL || API_URL;

      // Fetch browsing history entries
      const res = await updatePreferences(
        storageData.user_info,
        baseURL,
        request.payload
      );
      // Send the fetched history entries back as a response
      sendResponse(res);
    } catch (error) {
      // If an error occurs during fetching, send an error response
      sendResponse({ error: true });
    }
  }
};

/**
 * Function to handle user delete account and send the response.
 * @param {Object} chrome - Chrome API or Chrome-specific functionality.
 * @param {Function} sendResponse - Function to send the response back to the caller.
 * @returns {Promise<void>}
 */
export const handleDeleteUserAccount = async (chrome, sendResponse) => {
  // Check if the user is signed in
  const storageData = await getStorageData(chrome);
  if (storageData.userStatus) {
    try {
      const baseURL = storageData.baseURL || API_URL;

      // Fetch to delete user account
      const deleteUserAccountRes = await deleteUserAccount(
        storageData.user_info,
        baseURL
      );
      // Send the response to background js
      sendResponse(deleteUserAccountRes);
    } catch (error) {
      // If an error occurs during fetching, send an error response
      sendResponse({ error: true });
    }
  }
};
