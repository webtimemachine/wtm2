import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { LoginResponse } from '../interfaces/login.interface';
import { RestorePasswordErrorResponse } from '../interfaces/restore-password.interface';

export const handleRestorePassword: BackgroundMessageHandler<
  'restore-password'
> = async (sendResponse, payload) => {
  try {
    const { recoveryToken } = await chrome.storage.local.get(['recoveryToken']);
    if (!recoveryToken) throw new Error('recoveryToken is missing');

    const res = await apiClient.fetch('/api/auth/password/restore', {
      method: 'POST',
      body: JSON.stringify(payload.data),
      headers: {
        Authorization: `Bearer ${recoveryToken}`,
      },
    });

    if (res.status === 200) {
      const restorePassRes: LoginResponse = await res.json();
      const { accessToken, refreshToken } = restorePassRes;
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
      });
      sendResponse(restorePassRes);
    } else {
      const restorePassError: RestorePasswordErrorResponse = await res.json();
      throw new Error(restorePassError?.message?.toString());
    }
  } catch (error) {
    console.error('handleRestorePassword', error);
    sendResponse({ error: 'Error restoring the password' });
  }
};
