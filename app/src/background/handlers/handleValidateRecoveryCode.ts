import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';

import {
  ValidateRecoveryCodeResponse,
  ValidateRecoveryCodeErrorResponse,
} from '../interfaces/validate-recovery-code.interface';

export const handleValidateRecoveryCode: BackgroundMessageHandler<
  'validate-recovery-code'
> = async (sendResponse, payload) => {
  try {
    const res = await apiClient.fetch(
      '/api/auth/password/validate-recovery-code',
      {
        method: 'POST',
        body: JSON.stringify(payload.data),
      },
    );

    if (res.status === 200) {
      const validateRecoveryCodeRes: ValidateRecoveryCodeResponse =
        await res.json();
      const { recoveryToken } = validateRecoveryCodeRes;
      await chrome.storage.local.set({ recoveryToken });
      sendResponse(validateRecoveryCodeRes);
    } else {
      const validateRecoveryCodeError: ValidateRecoveryCodeErrorResponse =
        await res.json();
      throw new Error(validateRecoveryCodeError?.message?.toString());
    }
  } catch (error) {
    console.error('handleValidateRecoveryCode', error);
    sendResponse({ error: 'Error validating recovery code' });
  }
};
