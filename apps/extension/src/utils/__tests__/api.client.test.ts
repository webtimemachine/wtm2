import { LoginData, LoginResponse } from '@wtm/api';
import { apiClient } from '../api.client';

// Mocking the chrome storage local API
global.chrome = {
  storage: {
    local: {
      get: jest
        .fn()
        .mockReturnValueOnce({
          accessToken: 'mockAccessToken',
          serverUrl: 'https://test.com',
        })
        .mockReturnValueOnce({
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
          serverUrl: 'https://test.com/',
        }),
      set: jest.fn(),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

jest.mock('@wtm/api', () => {
  const mockApiClientInstance = {
    fetch: jest.fn().mockResolvedValue({
      status: 200,
    }),
    securedFetch: jest.fn().mockResolvedValue({
      status: 200,
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    }),
  };

  return {
    ApiClient: jest.fn().mockImplementation(() => mockApiClientInstance),
  };
});

describe('ApiClient', () => {
  afterAll(() => {
    jest.clearAllMocks(); // Restore all mocks after tests are done
  });

  describe('fetch', () => {
    it('should call fetch with the correct URL and options', async () => {
      const response = await apiClient.fetch('/test-endpoint');
      expect(response.status).toBe(200);
    });
  });

  describe('securedFetch', () => {
    it('should call fetch with the correct URL, options, and authorization header', async () => {
      const response = await apiClient.securedFetch('/test-endpoint');
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

      expect(response.accessToken).toBe('mockAccessToken');
      expect(response.refreshToken).toBe('mockRefreshToken');
    });
  });
});
