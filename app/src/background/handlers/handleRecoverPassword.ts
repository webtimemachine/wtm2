import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { VerifyCodeErrorResponse } from '../interfaces/verify-code.interface';
import { RecoverPasswordResponse } from '../interfaces/recover-password.interface';

export const handleRecoverPassword: BackgroundMessageHandler<
  'recover-password'
> = async (sendResponse, payload) => {
  try {
    const res = await apiClient.fetch('/api/auth/password/recover', {
      method: 'POST',
      body: JSON.stringify(payload.data),
    });

    if (res.status === 200) {
      const recoverPasswordResponse: RecoverPasswordResponse = await res.json();
      sendResponse(recoverPasswordResponse);
    } else {
      const verifyCodeErrorResponse: VerifyCodeErrorResponse = await res.json();
      throw new Error(verifyCodeErrorResponse?.message?.toString());
    }
  } catch (error) {
    sendResponse({ error: 'Error sending the recovery code' });
  }
};
