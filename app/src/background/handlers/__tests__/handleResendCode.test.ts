import { apiClient } from '../../api.client';
import { handleResendCode } from '../handleResendCode';

jest.mock('../../api.client', () => ({
  apiClient: {
    fetch: jest.fn(),
  },
}));

describe('handleResendCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resend code successfully', async () => {
    const sendResponse = jest.fn();
    const partialToken = 'partialToken123';

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { partialToken };
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const resendCodeResponseMock = { message: 'Code resent successfully' };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(resendCodeResponseMock),
    });

    await handleResendCode(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      message: 'Code resent successfully',
    });
  });

  it('should handle resend code errors gracefully', async () => {
    const sendResponse = jest.fn();

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { partialToken: null };
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const resendCodeErrorResponseMock = { message: 'Partial token is missing' };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce(resendCodeErrorResponseMock),
    });

    await handleResendCode(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error resending email verification code',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const partialToken = null;

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { partialToken };
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleResendCode(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error resending email verification code',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const partialToken = 'partialToken123';

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce((_, callback) => {
            callback({ partialToken });
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleResendCode(sendResponse, { data: undefined });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error resending email verification code',
    });
  });
});
