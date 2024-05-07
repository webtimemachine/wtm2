import { apiClient } from '../../api.client';
import { UpdatePreferenciesData } from '../../interfaces/preferences.interface';
import { handleUpdatePreferences } from '../handleUpdatePreferences';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleUpdatePreferences', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update preferences successfully', async () => {
    const sendResponse = jest.fn();
    const payload: UpdatePreferenciesData = {
      enableNavigationEntryExpiration: false,
      navigationEntryExpirationInDays: 0,
    };

    const updatePreferencesResponseMock = {
      message: 'Preferences updated successfully',
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(updatePreferencesResponseMock),
    });

    await handleUpdatePreferences(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith(updatePreferencesResponseMock);
  });

  it('should handle unauthorized error', async () => {
    const sendResponse = jest.fn();
    const payload: UpdatePreferenciesData = {
      enableNavigationEntryExpiration: false,
      navigationEntryExpirationInDays: 0,
    };
    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleUpdatePreferences(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: UpdatePreferenciesData = {
      enableNavigationEntryExpiration: false,
      navigationEntryExpirationInDays: 0,
    };
    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleUpdatePreferences(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while updating preferences',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload: UpdatePreferenciesData = {
      enableNavigationEntryExpiration: false,
      navigationEntryExpirationInDays: 0,
    };
    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleUpdatePreferences(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while updating preferences',
    });
  });
});
