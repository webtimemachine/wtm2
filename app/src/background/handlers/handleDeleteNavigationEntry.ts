import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { BasicResponse } from '../interfaces/basic-response';

export const handleDeleteNavigationEntry: BackgroundMessageHandler<
  'delete-navigation-entry'
> = async (sendResponse, payload) => {
  try {
    const deleteNavEntryRequestResponse = await apiClient.securedFetch(
      `/api/navigation-entry/${payload.data.id}`,
      {
        method: 'DELETE',
      },
    );

    if (deleteNavEntryRequestResponse.status === 401) {
      sendResponse({ error: 'Unauthorized' });
      return;
    }

    if (deleteNavEntryRequestResponse.status !== 200) {
      const errorJson = await deleteNavEntryRequestResponse.json();
      throw new Error(errorJson?.message || 'DELETE Navigation entry Error');
    }

    const deleteNavEntryResponse: BasicResponse =
      await deleteNavEntryRequestResponse.json();

    sendResponse(deleteNavEntryResponse);
  } catch (error) {
    sendResponse({ error: 'Error while deleting a navigation entry' });
  }
};
