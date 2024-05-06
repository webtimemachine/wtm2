import { apiClient } from '../../api.client';
import { RestorePasswordData } from '../../interfaces/restore-password.interface';
import { handleRestorePassword } from '../handleRestorePassword';

jest.mock('../../api.client', () => ({
  apiClient: {
    fetch: jest.fn(),
  },
}));

describe('handleRestorePassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should restore password successfully', async () => {
    const sendResponse = jest.fn();
    const recoveryToken = 'recoveryToken123';
    const payload: RestorePasswordData = {
      deviceKey: 'keyDevice',
      password: 'pass123',
      userAgent: '',
      userAgentData: '',
      verificationPassword: 'pass123',
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { recoveryToken };
          }),
          set: jest.fn(),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const restorePasswordResponseMock = {
      accessToken: 'accessToken123',
      refreshToken: 'refreshToken123',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(restorePasswordResponseMock),
    });

    await handleRestorePassword(sendResponse, { data: payload });

    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      restorePasswordResponseMock,
    );
    expect(sendResponse).toHaveBeenCalledWith(restorePasswordResponseMock);
  });

  it('should handle restore password errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: RestorePasswordData = {
      deviceKey: 'keyDevice',
      password: 'pass123',
      userAgent: '',
      userAgentData: '',
      verificationPassword: 'pass123',
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { recoveryToken: null };
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const restorePasswordErrorResponseMock = {
      message: 'Recovery token is missing',
    };

    (apiClient.fetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce(restorePasswordErrorResponseMock),
    });

    await handleRestorePassword(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error restoring the password',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const recoveryToken = 'recoveryToken123';
    const payload: RestorePasswordData = {
      deviceKey: 'keyDevice',
      password: 'pass123',
      userAgent: '',
      userAgentData: '',
      verificationPassword: 'pass123',
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { recoveryToken };
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

    await handleRestorePassword(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error restoring the password',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const recoveryToken = 'recoveryToken123';
    const payload: RestorePasswordData = {
      deviceKey: 'keyDevice',
      password: 'pass123',
      userAgent: '',
      userAgentData: '',
      verificationPassword: 'pass123',
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { recoveryToken };
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleRestorePassword(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error restoring the password',
    });
  });
});
