import { jest } from '@jest/globals';
import { getUserPreferencies, updatePreferences } from './settings';

describe('getUserPreferencies function', () => {
  // Mocking fetch function
  global.fetch = jest.fn();

  // Mocking console.error
  console.error = jest.fn();

  beforeEach(() => {
    fetch.mockClear(); // Clear mock function calls before each test
    console.error.mockClear(); // Clear console.error calls before each test
  });

  test('should return user preferences when fetch succeeds', async () => {
    // Mock successful fetch response
    const mockResponse = { preferences: 'mocked preferences' };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const result = await getUserPreferencies(user_info, baseURL);

    expect(result).toEqual(mockResponse); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/user/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch fails with other error', async () => {
    // Mock fetch response with error
    fetch.mockRejectedValueOnce(new Error('Mocked fetch error'));

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';

    await expect(getUserPreferencies(user_info, baseURL)).rejects.toThrow('refreshToken expired!');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });

});

describe('updatePreferences function', () => {
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
    const mockResponse = { message: 'Preferences updated successfully' };
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const payload = { preference: 'mockedPreference' };
    const result = await updatePreferences(user_info, baseURL, payload);

    expect(await result.json()).toEqual(mockResponse); // Expect the result to be the same as the mocked response
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/api/user/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user_info.accessToken}`,
      },
      body: JSON.stringify(payload),
    }); // Expect fetch to be called with the correct arguments
  });

  test('should throw error and log to console when fetch fails with other error', async () => {
    // Mock fetch response with error
    fetch.mockRejectedValueOnce(new Error('Mocked fetch error'));

    const user_info = { accessToken: 'mockedAccessToken' };
    const baseURL = 'mockedBaseURL';
    const payload = { preference: 'mockedPreference' };

    await expect(updatePreferences(user_info, baseURL, payload)).rejects.toThrow('refreshToken expired!');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Expect console.error to be called with an error message
  });
});
