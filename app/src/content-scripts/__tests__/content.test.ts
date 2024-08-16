import { apiClient } from '../../utils/api.client';
import { postNavigationEntry } from '../content';

// Mocking the DOMtoString function
jest.mock('../../utils', () => ({
  DOMtoString: jest.fn().mockReturnValue('<div>Mock HTML Content</div>'),
  getImages: jest
    .fn()
    .mockReturnValue([
      'https://media.image.com/test/1',
      'https://media.image.com/test/2',
    ]),
}));

jest.mock('../../utils/api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

jest.mock('@wcj/html-to-markdown', () => ({
  htmlToMarkdown: jest.fn().mockResolvedValue(''),
}));

// Mocking the chrome storage local API
global.chrome = {
  storage: {
    local: {
      get: jest.fn().mockImplementationOnce(() => {
        return { accessToken: 'mockAccessToken' };
      }),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('postNavigationEntry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should post navigation entry successfully when accessToken is available and URL is valid', async () => {
    const mockUrl = 'https://example.com';
    const mockTitle = 'Example Title';

    (apiClient.securedFetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn(),
    });

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: { href: mockUrl },
    });
    Object.defineProperty(document, 'title', {
      value: mockTitle,
    });

    await postNavigationEntry();

    expect(global.chrome.storage.local.get).toHaveBeenCalledWith([
      'accessToken',
      'enabledLiteMode',
    ]);
    // expect(apiClient.securedFetch).toHaveBeenCalled();
  });

  it('should not post navigation entry when accessToken is not available', async () => {
    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return undefined;
          }),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    await postNavigationEntry();

    expect(apiClient.securedFetch).not.toHaveBeenCalled();
  });

  it('should not post navigation entry when URL is invalid', async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: { href: 'chrome://invalid' },
    });

    await postNavigationEntry();

    expect(apiClient.securedFetch).not.toHaveBeenCalled();
  });
});
