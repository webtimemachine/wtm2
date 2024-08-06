import { LoginData, LoginResponse } from '../../interfaces';
import { apiClient } from '../api.client';

global.fetch = jest.fn(() => {
  return Promise.resolve({
    status: 200,
    json: jest.fn(() => ({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    })),
  });
}) as any;

describe('ApiClient', () => {
  afterAll(() => {
    jest.restoreAllMocks(); // Restore all mocks after tests are done
  });

  describe('fetch', () => {
    it('should call fetch with the correct URL and options', async () => {
      const response = await apiClient.fetch('/test-endpoint');
      expect(fetch).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('securedFetch', () => {
    it('should call fetch with the correct URL, options, and authorization header', async () => {
      const response = await apiClient.securedFetch('/test-endpoint');
      expect(fetch).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('login', () => {
    it('should call fetch with the correct URL, options, and handle successful login', async () => {
      const loginData: LoginData = {
        email: 'test@mail.com',
        password: 'pass123',
        deviceKey: 'keyDevice',
        userAgent: '',
        userAgentData: '',
      };

      const response: LoginResponse = (await apiClient.login(
        loginData,
      )) as LoginResponse;
      expect(fetch).toHaveBeenCalled();
      expect(response.accessToken).toBe('mockAccessToken');
      expect(response.refreshToken).toBe('mockRefreshToken');
    });
  });
});
