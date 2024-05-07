import { apiClient } from '../../api.client';
import { CloseActiveSessionsData } from '../../interfaces/close-active-session';
import { handleCloseActiveSession } from '../handleCloseActiveSession';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleCloseActiveSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should close an active session successfully', async () => {
    const sendResponse = jest.fn();
    const payload: CloseActiveSessionsData = { sessionIds: [1] };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Session closed successfully' }),
    });

    await handleCloseActiveSession(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      message: 'Session closed successfully',
    });
  });

  it('should handle unauthorized access', async () => {
    const sendResponse = jest.fn();
    const payload: CloseActiveSessionsData = { sessionIds: [1] };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    await handleCloseActiveSession(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: CloseActiveSessionsData = { sessionIds: [1] };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ message: undefined }),
    });

    await handleCloseActiveSession(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while closing an active session',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload: CloseActiveSessionsData = { sessionIds: [1] };

    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleCloseActiveSession(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while closing an active session',
    });
  });
});
