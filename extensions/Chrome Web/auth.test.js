import { jest } from '@jest/globals'
import * as auth from './auth.js'

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

  test('should generate a random token', () => {
    // Mock crypto.getRandomValues
    const cryptoMock = {
      getRandomValues: jest.fn().mockImplementation(array => {
        // Simulate filling the array with random values
        for (let i = 0; i < array.length; ++i) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }),
    };

    // Provide the mock crypto object to the function
    global.crypto = cryptoMock;

    // Call the function
    const result = auth.getRandomToken();

    // Expectations
    expect(cryptoMock.getRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
    expect(result).toMatch(/^[0-9a-fA-F]+$/); // Check if the result is a hexadecimal string
  });
});
