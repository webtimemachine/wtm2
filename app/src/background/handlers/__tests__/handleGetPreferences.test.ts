import { apiClient } from '../../api.client';
import { PreferenciesResponse } from '../../interfaces/preferences.interface';
import { handleGetPreferences } from '../handleGetPreferences';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleGetPreferences', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user preferences successfully', async () => {
    const sendResponse = jest.fn();

    const preferencesMock: PreferenciesResponse = {
      id: 1,
      userId: 1,
      enableNavigationEntryExpiration: true,
      navigationEntryExpirationInDays: 7,
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(preferencesMock),
    });

    await handleGetPreferences(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith(preferencesMock);
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleGetPreferences(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ message: undefined }),
    });

    await handleGetPreferences(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while getting user preferences',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleGetPreferences(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while getting user preferences',
    });
  });
});
