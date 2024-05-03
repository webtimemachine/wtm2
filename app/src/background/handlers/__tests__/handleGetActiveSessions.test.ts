import { apiClient } from '../../api.client';
import { ActiveSession } from '../../interfaces/active-sessons.interface';
import { handleGetActiveSessions } from '../handleGetActiveSessions';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleGetActiveSessions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get active sessions successfully', async () => {
    const sendResponse = jest.fn();

    const activeSessionsMock: ActiveSession[] = [
      {
        id: 1,
        userDeviceId: 1,
        expiration: new Date(new Date().getDate() + 7),
        createdAt: new Date(),
        updateAt: new Date(),
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
      },
    ];

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(activeSessionsMock),
    });

    await handleGetActiveSessions(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith(activeSessionsMock);
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleGetActiveSessions(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleGetActiveSessions(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while getting active sessions',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleGetActiveSessions(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while getting active sessions',
    });
  });
});
