import { apiClient } from '../../api.client';
import { GetVersionResponse } from '../../interfaces/get-version.interface';
import { handleGetVersion } from '../handleGetVersion';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleGetVersion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get version successfully', async () => {
    const sendResponse = jest.fn();

    const versionMock: GetVersionResponse = {
      version: '1.0.0',
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(versionMock),
    });

    await handleGetVersion(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith(versionMock);
  });

  it('should handle errors gracefully', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleGetVersion(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleGetVersion(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error geting version',
    });
  });
});
