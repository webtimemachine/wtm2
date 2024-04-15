import { jest } from '@jest/globals';
import { getUserActiveSessions, logoutSessionBySessionId } from './active-sessions';


describe('getUserActiveSessions function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return user active sessions when fetch succeeds', async () => {
    // Mock successful fetch response
    const mockResponse = { sessions: ['session1', 'session2'] };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const result = await getUserActiveSessions(user_info, baseURL);

    expect(mockResponse).toEqual(result); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/auth/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error when fetch returns 401', async () => {
    // Mock fetch response with status 401
    fetch.mockResolvedValueOnce({
      status: 401,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';

    await expect(getUserActiveSessions(user_info, baseURL)).rejects.toThrow('refreshToken expired!');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });
});

describe('logoutSessionBySessionId function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return response when fetch succeeds', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const payload = { sessionId: 'session123' };
    await logoutSessionBySessionId(user_info, baseURL, payload);
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/auth/session/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user_info.accessToken}`,
      },
      body: JSON.stringify(payload),
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch returns 401', async () => {
    // Mock fetch response with status 401
    fetch.mockResolvedValueOnce({
      status: 401,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const payload = { sessionId: 'session123' };

    await expect(logoutSessionBySessionId(user_info, baseURL, payload)).rejects.toThrow('refreshToken expired!');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });
});
