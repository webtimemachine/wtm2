import { apiClient } from '../../api.client';
import { handleDeleteNavigationEntry } from '../handleDeleteNavigationEntry';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleDeleteNavigationEntry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a navigation entry successfully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 123 } };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce({
        message: 'Navigation entry deleted successfully',
      }),
    });

    await handleDeleteNavigationEntry(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      message: 'Navigation entry deleted successfully',
    });
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 123 } };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleDeleteNavigationEntry(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 123 } };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ message: undefined }),
    });

    await handleDeleteNavigationEntry(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while deleting a navigation entry',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { id: 123 } };

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleDeleteNavigationEntry(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while deleting a navigation entry',
    });
  });
});
