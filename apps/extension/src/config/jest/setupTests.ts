// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.chrome = {
  storage: {
    local: {
      get: jest.fn().mockImplementationOnce((_, callback) =>
        callback({
          accessToken: 'mockAccessToken',
        }),
      ),
    },
  },
  runtime: {
    connect: jest.fn().mockReturnValue({
      postMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn(),
      },
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
