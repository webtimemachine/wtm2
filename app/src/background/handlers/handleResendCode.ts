import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import {
  ResendCodeResponse,
  ResendCodeErrorResponse,
} from '../interfaces/resend-code-interface';

export const handleResendCode: BackgroundMessageHandler<'resend-code'> = async (
  sendResponse,
  _,
) => {
  try {
    const { partialToken } = await chrome.storage.local.get(['partialToken']);
    if (!partialToken) throw new Error('partialToken is missing');

    const res = await apiClient.fetch('/api/auth/verify/resend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const resendCodeResponse: ResendCodeResponse = await res.json();
      sendResponse(resendCodeResponse);
    } else {
      const resendCodeErrorResponse: ResendCodeErrorResponse = await res.json();
      throw new Error(resendCodeErrorResponse?.message?.toString());
    }
  } catch (error) {
    console.error('handleResendCode', error);
    sendResponse({ error: 'Error resending email verification code' });
  }
};
