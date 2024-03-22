import { jest } from '@jest/globals';
import * as auth from './auth.js';
import { API_URL } from './consts.js';

describe('Should run all unit tests related to authorization', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
      }),
    );
  });

  test('should resolve with userStatus false and empty user_info if chrome.storage.local returns an error', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockRejectedValue('Some error'),
        },
      },
      runtime: {
        lastError: 'Some error',
      },
    };

    const storageData = await auth.getStorageData(chromeMock);
    expect(storageData).toEqual({
      userStatus: false,
      user_info: {},
    });
  });

  test('should resolve with userStatus false and empty user_info if response.userStatus is undefined', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockResolvedValue({}),
        },
      },
      runtime: {
        lastError: null,
      },
    };

    const storageData = await auth.getStorageData(chromeMock);
    expect(storageData).toEqual({
      userStatus: false,
      user_info: {},
    });
  });

  test('should resolve with correct userStatus and user_info from chrome.storage.local response', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockResolvedValue({
            userStatus: true,
            user_info: { email: 'demo@email.com' },
          }),
        },
      },
      runtime: {
        lastError: null,
      },
    };

    const storageData = await auth.getStorageData(chromeMock);
    expect(storageData).toEqual({
      userStatus: true,
      user_info: { email: 'demo@email.com' },
    });
  });

  test('should generate a random token', () => {
    // Mock crypto.getRandomValues
    const cryptoMock = {
      getRandomValues: jest.fn().mockImplementation((array) => {
        // Simulate filling the array with random values
        for (let i = 0; i < array.length; ++i) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }),
    };

    // Provide the mock crypto object to the function
    global.crypto = cryptoMock;

    // Call the function
    const storageData = auth.getRandomToken();

    // Expectations
    expect(cryptoMock.getRandomValues).toHaveBeenCalledWith(
      expect.any(Uint8Array),
    );
    expect(storageData).toMatch(/^[0-9a-fA-F]+$/); // Check if the storageData is a hexadecimal string
  });

  test('should call fetch with the correct arguments', async () => {
    const payload = {
      email: 'mockEmail',
      password: 'mockPassword',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      baseURL: API_URL,
    };
    const deviceId = 'mockDeviceId';

    await auth.loginUser(payload, deviceId);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/auth/login`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          userAgent: payload.userAgent,
          deviceKey: deviceId,
        }),
      }),
    );
  });

  test('should return a response when successful', async () => {
    const payload = {
      email: 'mockEmail',
      password: 'mockPassword',
    };
    const deviceId = 'mockDeviceId';

    const response = await auth.loginUser(payload, deviceId);

    expect(response.ok).toBe(true);
  });

  test('should log error when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('Mock error'));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await auth.loginUser({}, '');

    expect(spyConsoleError).toHaveBeenCalledWith('Mock error');
    spyConsoleError.mockRestore();
  });

  test('should call fetch with the correct arguments', async () => {
    const data = {
      user_info: {
        refreshToken: 'mockRefreshToken',
      },
    };

    await auth.refreshUser(data);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/auth/refresh`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.user_info.refreshToken}`,
        }),
      }),
    );
  });

  test('should return a response when successful', async () => {
    const data = {
      user_info: {
        refreshToken: 'mockRefreshToken',
      },
    };

    const response = await auth.refreshUser(data);

    expect(response.ok).toBe(true);
  });

  test('should log error when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('Mock error'));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await auth.refreshUser({});

    expect(spyConsoleError).toHaveBeenCalledWith('Mock error');
    spyConsoleError.mockRestore();
  });

  test('should return a successful response when user create a new account', async () => {
    const payload = {
      email: 'mockNewEmail',
      password: 'mockNewPassword',
    };

    const response = await auth.signUpUser(payload);

    expect(response.ok).toBe(true);
  });

  test('should log error when fetch sign up user function fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('Mock error'));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await auth.signUpUser({}, '');

    expect(spyConsoleError).toHaveBeenCalledWith('Mock error');
    spyConsoleError.mockRestore();
  });
});
