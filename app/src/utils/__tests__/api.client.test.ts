import { LoginData, LoginResponse } from 'wtm-lib/interfaces';
import { apiClient } from '../api.client';

global.fetch = jest.fn(() => {
  return Promise.resolve({
    status: 200,
    json: jest.fn(() => ({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    })),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

describe('ApiClient', () => {
  beforeAll(() => {
    // Mocking the chrome storage local API
    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementation(() => {
            return {
              accessToken: 'mockAccessToken',
              serverUrl: 'https://test.com',
            };
          }),
          set: jest.fn(),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

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
      // Mock fetch to return a resolved promise with a dummy response
      global.chrome = {
        storage: {
          local: {
            get: jest.fn().mockImplementation(() => {
              return {
                accessToken: 'mockAccessToken',
                refreshToken: 'mockRefreshToken',
                serverUrl: 'https://test.com/',
              };
            }),
            set: jest.fn(),
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

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
