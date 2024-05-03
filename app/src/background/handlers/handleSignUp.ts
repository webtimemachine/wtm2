import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import {
  SignUpErrorResponse,
  SignUpResponse,
} from '../interfaces/sign-up.interface';

export const handleSignUp: BackgroundMessageHandler<'sign-up'> = async (
  sendResponse,
  payload,
) => {
  try {
    const res = await apiClient.securedFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload.data),
    });

    if (res.status === 200) {
      const signUpResponse: SignUpResponse = await res.json();
      const { partialToken } = signUpResponse;
      await chrome.storage.local.set({ partialToken });
      sendResponse(signUpResponse);
    } else {
      const signUpErrorResponse: SignUpErrorResponse = await res.json();
      sendResponse({
        error:
          signUpErrorResponse?.error ||
          signUpErrorResponse?.message?.toString(),
      });
    }
  } catch (error) {
    sendResponse({ error: 'Error while sign up' });
  }
};
