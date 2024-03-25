import { jest } from '@jest/globals';
import {
  saveHistoryEntry,
  getHistoryEntries,
  deleteHistoryEntries,
} from './history-entries.js';
import { API_URL } from './consts.js';

describe('Should run all test for saveHistoryEntry & getHistoryEntries functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
      }),
    );
    global.chrome = {
      storage: {
        local: {
          set: jest.fn(),
        },
      },
    };
  });

  test('should call fetch with the correct arguments', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
      user: {
        email: 'user-connected@mail.com',
      },
    };
    const payload = { data: 'mockPayload' };

    await saveHistoryEntry(user_info, API_URL, payload);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/navigation-entry`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_info.accessToken}`,
        }),
        body: JSON.stringify(payload),
      }),
    );
  });

  test('should return a response when successful', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
      user: {
        email: 'user-connected@mail.com',
      },
    };
    const payload = { data: 'mockPayload' };

    const response = await saveHistoryEntry(user_info, API_URL, payload);

    expect(response.ok).toBe(true);
  });

  test('should call refresh token function when fetch fails with 401', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject({ status: 401 }));
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await saveHistoryEntry({}, API_URL, {});

    expect(spyConsoleError).toHaveBeenCalledWith({ status: 401 });
    spyConsoleError.mockRestore();
  });

  test('should call fetch with the correct arguments', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
      user: {
        email: 'user-connected@mail.com',
      },
    };

    await getHistoryEntries(user_info, API_URL, 0, 10, null, true);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/navigation-entry?offset=0&limit=10&isSemantic=true`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_info.accessToken}`,
        }),
      }),
    );
  });

  test('should return the response data when successful', async () => {
    const user_info = {
      accessToken: 'mockAccessToken',
      user: {
        email: 'user-connected@mail.com',
      },
    };
    const responseData = { data: 'mockData', user: 'user-connected@mail.com' };
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(responseData),
        ok: true,
      }),
    );

    const response = await getHistoryEntries(user_info, API_URL, 0, 10);

    expect(response).toEqual(responseData);
  });

  test('should call refresh token function when fetch fails with 401', async () => {
    const responseData = { data: 'mockData', user: 'user-connected@mail.com' };
    global.fetch
      .mockImplementationOnce(() => Promise.reject({ status: 401 }))
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(responseData),
          ok: true,
        }),
      );
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await getHistoryEntries({}, API_URL, 0, 10);

    expect(spyConsoleError).toHaveBeenCalledWith({ status: 401 });
    spyConsoleError.mockRestore();
  });

  test('should delete history entry successfully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ success: true }),
      }),
    );

    const user_info = { accessToken: 'mockAccessToken' };
    const payload = { id: 123 };
    const result = await deleteHistoryEntries(user_info, API_URL, payload);
    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/navigation-entry/${payload.id}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_info.accessToken}`,
        }),
      }),
    );
  });

  test('should throw error if access token has expired when try to delete history entry', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.reject({ status: 401 }))
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ success: true }),
        }),
      );
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const user_info = { accessToken: 'expiredAccessToken' };
    const payload = { id: 123 };
    await deleteHistoryEntries(user_info, API_URL, payload);

    expect(spyConsoleError).toHaveBeenCalledWith({ status: 401 });
    spyConsoleError.mockRestore();
  });
});
