import { apiClient } from '../../api.client';
import { ValidateRecoveryCodeData } from '../../interfaces/validate-recovery-code.interface';
import { handleValidateRecoveryCode } from '../handleValidateRecoveryCode';

jest.mock('../../api.client', () => ({
  apiClient: {
    fetch: jest.fn(),
  },
}));

describe('handleValidateRecoveryCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate recovery code successfully', async () => {
    const sendResponse = jest.fn();
    const payload: ValidateRecoveryCodeData = {
      email: 'test@test.com',
      recoveryCode: '123456',
    };

    const validateRecoveryCodeResponseMock = {
      recoveryToken: 'recoveryToken123',
    };
    global.chrome = {
      storage: {
        local: {
          set: jest.fn(),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(validateRecoveryCodeResponseMock),
    });

    await handleValidateRecoveryCode(sendResponse, { data: payload });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      recoveryToken: 'recoveryToken123',
    });
    expect(sendResponse).toHaveBeenCalledWith(validateRecoveryCodeResponseMock);
  });

  it('should handle validation error', async () => {
    const sendResponse = jest.fn();
    const payload: ValidateRecoveryCodeData = {
      email: 'test@test.com',
      recoveryCode: '123456',
    };
    const validateRecoveryCodeErrorResponseMock = {
      message: 'Invalid recovery code',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest
        .fn()
        .mockResolvedValueOnce(validateRecoveryCodeErrorResponseMock),
    });

    await handleValidateRecoveryCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error validating recovery code',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: ValidateRecoveryCodeData = {
      email: 'test@test.com',
      recoveryCode: '123456',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleValidateRecoveryCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error validating recovery code',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload: ValidateRecoveryCodeData = {
      email: 'test@test.com',
      recoveryCode: '123456',
    };

    (apiClient.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleValidateRecoveryCode(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error validating recovery code',
    });
  });
});
