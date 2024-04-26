import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { BasicResponse } from '../interfaces/basic-response';

export const handleConfirmDeleteAccount: BackgroundMessageHandler<
  'confirm-delete-account'
> = async (sendResponse, payload) => {
  try {
    const confirmDeleteAccountResponse = await apiClient.securedFetch(
      '/api/user',
      {
        method: 'DELETE',
        body: JSON.stringify(payload.data),
      },
    );

    if (confirmDeleteAccountResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (confirmDeleteAccountResponse.status !== 200) {
      const errorJson = await confirmDeleteAccountResponse.json();
      throw new Error(
        errorJson?.message || 'DELETE Confirm delete account Error',
      );
    }

    const confirmResponse: BasicResponse =
      await confirmDeleteAccountResponse.json();

    sendResponse(confirmResponse);
  } catch (error) {
    console.error('handleConfirmDeleteAccount', error);
    sendResponse({ error: 'Error while confirm deleting account' });
  }
};
