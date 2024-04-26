import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { VerifyCodeErrorResponse } from '../interfaces/verify-code.interface';
import { LoginResponse } from '../interfaces/login.interface';

export const handleVerifyCode: BackgroundMessageHandler<'verify-code'> = async (
  sendResponse,
  payload,
) => {
  try {
    const { partialToken } = await chrome.storage.local.get(['partialToken']);
    if (!partialToken) throw new Error('partialToken is missing');

    const res = await apiClient.fetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify(payload.data),
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const emailVerifyRes: LoginResponse = await res.json();
      const { accessToken, refreshToken } = emailVerifyRes;
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
      });
      sendResponse(emailVerifyRes);
    } else {
      const verifyCodeErrorResponse: VerifyCodeErrorResponse = await res.json();
      throw new Error(verifyCodeErrorResponse?.message?.toString());
    }
  } catch (error) {
    console.error('handleVerifyCode', error);
    sendResponse({ error: 'Error verifing email verification code' });
  }
};
