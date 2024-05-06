import { apiClient } from '../../api.client';
import { VerifyCodeData } from '../../interfaces/verify-code.interface';
import { handleVerifyCode } from '../handleVerifyCode';

jest.mock('../../api.client', () => ({
  apiClient: {
    fetch: jest.fn(),
  },
}));

describe('handleVerifyCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should verify code and update tokens successfully', async () => {
    const sendResponse = jest.fn();
    const payload: VerifyCodeData = {
      deviceKey: 'device_id',
      verificationCode: '123456',
      userAgent: '',
      userAgentData: '',
    };

    const accessToken = 'accessToken123';
    const refreshToken = 'refreshToken123';

    const emailVerifyResponseMock = { accessToken, refreshToken };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { partialToken: 'partial123' };
          }),
          set: jest.fn(),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(emailVerifyResponseMock),
    });

    await handleVerifyCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith(emailVerifyResponseMock);
  });

  it('should handle verification error', async () => {
    const sendResponse = jest.fn();
    const payload: VerifyCodeData = {
      deviceKey: 'device_id',
      verificationCode: '123456',
      userAgent: '',
      userAgentData: '',
    };

    const verifyCodeErrorResponseMock = {
      message: 'Invalid verification code',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce(verifyCodeErrorResponseMock),
    });

    await handleVerifyCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error verifying email verification code',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: VerifyCodeData = {
      deviceKey: 'device_id',
      verificationCode: '123456',
      userAgent: '',
      userAgentData: '',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleVerifyCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error verifying email verification code',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload: VerifyCodeData = {
      deviceKey: 'device_id',
      verificationCode: '123456',
      userAgent: '',
      userAgentData: '',
    };

    (apiClient.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleVerifyCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error verifying email verification code',
    });
  });
});
