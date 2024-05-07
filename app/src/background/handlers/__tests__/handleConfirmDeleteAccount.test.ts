import { apiClient } from '../../api.client';
import { handleConfirmDeleteAccount } from '../handleConfirmDeleteAccount';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleConfirmDeleteAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should confirm delete account successfully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: undefined };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Account deleted successfully' }),
    });

    await handleConfirmDeleteAccount(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      message: 'Account deleted successfully',
    });
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();
    const payload = { data: undefined };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleConfirmDeleteAccount(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: undefined };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ message: undefined }),
    });

    await handleConfirmDeleteAccount(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while confirm deleting account',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload = { data: undefined };

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleConfirmDeleteAccount(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while confirm deleting account',
    });
  });
});
