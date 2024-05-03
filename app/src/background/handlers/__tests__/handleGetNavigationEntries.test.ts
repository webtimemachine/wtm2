import { apiClient } from '../../api.client';
import {
  CompleteNavigationEntryDto,
  GetNavigationEntriesResponse,
} from '../../interfaces/navigation-entry.interface';
import { handleGetNavigationEntries } from '../handleGetNavigationEntries';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleGetNavigationEntries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get navigation entries successfully', async () => {
    const sendResponse = jest.fn();
    const payload = {
      data: { offset: 0, limit: 10, query: '', isSemantic: true },
    };

    const navigationEntry: CompleteNavigationEntryDto = {
      id: 1,
      url: `http://example.com/`,
      title: `Page 1`,
      navigationDate: new Date(),
      userId: 1,
      userDeviceId: 1,
      userDevice: {
        id: 1,
        userId: 1,
        deviceId: 1,
        isCurrentDevice: true,
        deviceAlias: `Device test`,
        device: {
          id: 1,
          deviceKey: `DeviceKey test`,
        },
      },
      expirationDate: new Date(),
    };

    const navigationEntriesMock: GetNavigationEntriesResponse = {
      offset: 0,
      limit: 10,
      count: 20,
      query: '',
      items: [navigationEntry],
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(navigationEntriesMock),
    });

    await handleGetNavigationEntries(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith(navigationEntriesMock);
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();
    const payload = {
      data: { offset: 0, limit: 10, query: '', isSemantic: true },
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleGetNavigationEntries(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = {
      data: { offset: 0, limit: 10, query: '', isSemantic: true },
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ message: undefined }),
    });

    await handleGetNavigationEntries(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'GET Navigation Entries Error',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload = {
      data: { offset: 0, limit: 10, query: '', isSemantic: true },
    };

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(undefined);

    await handleGetNavigationEntries(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'GET Navigation Entries Error',
    });
  });
});
