const auth = require('./auth');

describe('is_user_signed_in', () => {
  test('should resolve with userStatus false and empty user_info if chrome.storage.local returns an error', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockImplementation((keys, callback) => {
            callback({ userStatus: false, user_info: {} });
          })
        }
      },
      runtime: {
        lastError: 'Some error'
      }
    };

    const result = await auth.is_user_signed_in(chromeMock);
    expect(result).toEqual({
      userStatus: false,
      user_info: {}
    });
  });

  test('should resolve with userStatus false and empty user_info if response.userStatus is undefined', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockImplementation((keys, callback) => {
            callback({});
          })
        }
      },
      runtime: {
        lastError: null
      }
    };

    const result = await auth.is_user_signed_in(chromeMock);
    expect(result).toEqual({
      userStatus: false,
      user_info: {}
    });
  });

  test('should resolve with correct userStatus and user_info from chrome.storage.local response', async () => {
    const chromeMock = {
      storage: {
        local: {
          get: jest.fn().mockImplementation((keys, callback) => {
            callback({ userStatus: true, user_info: { email: 'demo@email.com' } });
          })
        }
      },
      runtime: {
        lastError: null
      }
    };

    const result = await auth.is_user_signed_in(chromeMock);
    expect(result).toEqual({
      userStatus: true,
      user_info: { email: 'demo@email.com' }
    });
  });
});
