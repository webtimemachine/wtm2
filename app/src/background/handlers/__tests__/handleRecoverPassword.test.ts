import { apiClient } from '../../api.client';
import { handleRecoverPassword } from '../handleRecoverPassword';

jest.mock('../../api.client', () => ({
  apiClient: {
    fetch: jest.fn(),
  },
}));

describe('handleRecoverPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should recover password successfully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { email: 'test@example.com' } };
    const recoverPasswordResponseMock = {
      message: 'Recovery code sent successfully',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(recoverPasswordResponseMock),
    });

    await handleRecoverPassword(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith(recoverPasswordResponseMock);
  });

  it('should handle verification code errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { email: 'test@example.com' } };
    const verifyCodeErrorResponseMock = { message: 'Invalid email' };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce(verifyCodeErrorResponseMock),
    });

    await handleRecoverPassword(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error sending the recovery code',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { email: 'test@example.com' } };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleRecoverPassword(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error sending the recovery code',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload = { data: { email: 'test@example.com' } };

    (apiClient.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleRecoverPassword(sendResponse, payload);

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error sending the recovery code',
    });
  });
});
