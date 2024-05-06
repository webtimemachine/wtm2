import { apiClient } from '../../api.client';
import { handleUpdateDeviceAlias } from '../handleUpdateDeviceAlias';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleUpdateDeviceAlias', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update device alias successfully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 1, deviceAlias: 'New Alias' } };

    const updateDeviceAliasResponseMock = {
      message: 'Device alias updated successfully',
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(updateDeviceAliasResponseMock),
    });

    await handleUpdateDeviceAlias(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith(updateDeviceAliasResponseMock);
  });

  it('should handle unauthorized error', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 1, deviceAlias: 'New Alias' } };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleUpdateDeviceAlias(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 1, deviceAlias: 'New Alias' } };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleUpdateDeviceAlias(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while updating device alias',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 1, deviceAlias: 'New Alias' } };

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleUpdateDeviceAlias(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while updating device alias',
    });
  });
});
