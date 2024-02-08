import { jest } from '@jest/globals'
import { saveHistoryEntry, getHistoryEntries } from './history-entries.js';
import { API_URL } from './consts.js';

describe('Should run all test for saveHistoryEntry & getHistoryEntries functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
      })
    );
    global.chrome = {
      storage: {
        local: {
          set: jest.fn()
        }
      }
    }
  });

  test('should call fetch with the correct arguments', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
    };
    const payload = { data: 'mockPayload' };

    await saveHistoryEntry(user_info, payload);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/navigation-entry`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_info.accessToken}`,
        }),
        body: JSON.stringify(payload),
      })
    );
  });

  test('should return a response when successful', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
    };
    const payload = { data: 'mockPayload' };

    const response = await saveHistoryEntry(user_info, payload);

    expect(response.ok).toBe(true);
  });

  test('should call refresh token function when fetch fails with 401', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject({ status: 401 }));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await saveHistoryEntry({}, {});

    expect(spyConsoleError).toHaveBeenCalledWith({ status: 401 });
    spyConsoleError.mockRestore();
  });

  test('should call fetch with the correct arguments', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
    };

    await getHistoryEntries(user_info, 0, 10);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/navigation-entry?offset=0&limit=10`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_info.accessToken}`,
        }),
      })
    );
  });

  test('should return the response data when successful', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
    };
    const responseData = { data: 'mockData' };
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(responseData),
        ok: true,
      })
    );

    const response = await getHistoryEntries(user_info, 0, 10);

    expect(response).toEqual(responseData);
  });

  test('should call refresh token function when fetch fails with 401', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject({ status: 401 }));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await getHistoryEntries({}, 0, 10);

    expect(spyConsoleError).toHaveBeenCalledWith({ status: 401 });
    spyConsoleError.mockRestore();
  });
});
