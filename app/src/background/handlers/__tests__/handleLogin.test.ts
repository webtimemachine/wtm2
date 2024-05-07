import { apiClient } from '../../api.client';
import { LoginData } from '../../interfaces/login.interface';
import { handleLogin } from '../handleLogin';

jest.mock('../../api.client', () => ({
  apiClient: {
    login: jest.fn(),
  },
}));

describe('handleLogin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const sendResponse = jest.fn();
    const payload: LoginData = {
      email: 'test@mail.com',
      password: 'pass123',
      deviceKey: 'keyDevice',
      userAgent: '',
      userAgentData: '',
    };
    const loginResponseMock = { token: 'token123' };

    (apiClient.login as jest.Mock).mockResolvedValueOnce(loginResponseMock);

    await handleLogin(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith(loginResponseMock);
  });

  it('should handle login errors gracefully', async () => {
    const sendResponse = jest.fn();
    const payload: LoginData = {
      email: 'test@mail.com',
      password: 'pass123',
      deviceKey: 'keyDevice',
      userAgent: '',
      userAgentData: '',
    };

    (apiClient.login as jest.Mock).mockRejectedValueOnce(
      new Error('Login Error'),
    );

    await handleLogin(sendResponse, { data: payload });

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Error while login' });
  });
});
