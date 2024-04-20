import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';

export const handleLogin: BackgroundMessageHandler<'login'> = async (
  sendResponse,
  payload,
) => {
  try {
    const loginResponse = await apiClient.login(payload.data);
    sendResponse(loginResponse);
  } catch (error) {
    console.error('handleLogin', error);
    sendResponse({ error: 'Error while login' });
  }
};
