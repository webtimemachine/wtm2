import { apiClient } from '../../api.client';
import { SignUpData } from '../../interfaces/sign-up.interface';
import { handleSignUp } from '../handleSignUp';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleSignUp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign up successfully', async () => {
    const sendResponse = jest.fn();
    const payload: SignUpData = {
      email: 'test@test.com',
      password: 'pass123',
    };

    const signUpResponseMock = { partialToken: 'partialToken123' };

    global.chrome = {
      storage: {
        local: {
          set: jest.fn(),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(signUpResponseMock),
    });

    await handleSignUp(sendResponse, { data: payload });

    expect(chrome.storage.local.set).toHaveBeenCalledWith(signUpResponseMock);
    expect(sendResponse).toHaveBeenCalledWith(signUpResponseMock);
  });

  it('should handle sign up errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: SignUpData = {
      email: 'test@test.com',
      password: 'pass123',
    };
    const signUpErrorResponseMock = { message: 'Username already exists' };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValueOnce(signUpErrorResponseMock),
    });

    await handleSignUp(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Username already exists',
    });
  });

  it('should handle other errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: SignUpData = {
      email: 'test@test.com',
      password: 'pass123',
    };

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await handleSignUp(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
  });

  it('should handle network errors', async () => {
    const sendResponse = jest.fn();
    const payload: SignUpData = {
      email: 'test@test.com',
      password: 'pass123',
    };
    (apiClient.securedFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    await handleSignUp(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Error while sign up',
    });
  });
});
