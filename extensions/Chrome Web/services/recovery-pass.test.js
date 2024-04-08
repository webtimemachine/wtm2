import { jest } from '@jest/globals';
import {
  restorePassword,
  recoverPassword,
  validateRecoveryCode,
} from './recovery-pass';

describe('recoverPassword function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return response when fetch succeeds', async () => {
    // Mock successful fetch response
    const mockResponse = {
      message: 'Recovery code sent to your email',
    };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const baseURL = 'mockedBaseURL';
    const payload = { email: 'test@example.com' };
    const result = await recoverPassword(baseURL, payload);

    const data = await result.json();
    expect(data).toEqual(mockResponse); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/auth/password/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch fails', async () => {
    // Mock fetch response with status other than 200
    fetch.mockResolvedValueOnce({
      status: 400,
    });

    const baseURL = 'mockedBaseURL';
    const payload = { email: 'test@example.com' };

    await recoverPassword(baseURL, payload);
    expect(console.error).toHaveBeenCalled();
  });
});

describe('validateRecoveryCode function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return response when fetch succeeds', async () => {
    // Mock successful fetch response
    const mockResponse = { message: 'Email recovery validated successfully' };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const baseURL = 'mockedBaseURL';
    const payload = { email: 'test@example.com', code: '123456' };
    const result = await validateRecoveryCode(baseURL, payload);

    const data = await result.json();
    expect(data).toEqual(mockResponse); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(
      `${baseURL}/api/auth/password/validate-recovery-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    ); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch fails', async () => {
    // Mock fetch response with status other than 200
    fetch.mockResolvedValueOnce({
      status: 400,
    });

    const baseURL = 'mockedBaseURL';
    const payload = { email: 'test@example.com', code: '123456' };

    await validateRecoveryCode(baseURL, payload);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });
});

describe('restorePassword function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return response when fetch succeeds', async () => {
    // Mock successful fetch response
    const mockResponse = {
      message: 'Password recovery completed successfully',
    };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const recoveryToken = 'mockedRecoveryToken';
    const baseURL = 'mockedBaseURL';
    const payload = { newPassword: 'newPassword123' };
    const result = await restorePassword(recoveryToken, baseURL, payload);

    const data = await result.json();
    expect(data).toEqual(mockResponse); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/auth/password/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recoveryToken}`,
      },
      body: JSON.stringify(payload),
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch returns 401', async () => {
    // Mock fetch response with status 401
    fetch.mockResolvedValueOnce({
      status: 401,
    });

    const recoveryToken = 'mockedRecoveryToken';
    const baseURL = 'mockedBaseURL';
    const payload = { newPassword: 'newPassword123' };

    await restorePassword(recoveryToken, baseURL, payload);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });
});
