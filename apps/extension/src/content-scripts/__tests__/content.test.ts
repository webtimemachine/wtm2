import { apiClient } from '../../utils/api.client';
import { postNavigationEntry } from '../content';

// Mocking the DOMtoString function
jest.mock('@wtm/utils', () => ({
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
    securedFetch: jest.fn().mockResolvedValueOnce({
      status: 200,
      json: jest.fn(),
    }),
  },
}));

jest.mock('dom-to-semantic-markdown', () => ({
  getSemanticMarkdownForLLM: jest.fn().mockResolvedValue(''),
}));

jest.mock('cheerio', () => ({
  Cheerio: jest.fn().mockResolvedValue(''),
}));

describe('postNavigationEntry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should post navigation entry successfully when accessToken is available and URL is valid', async () => {
    const mockUrl = 'https://example.com';
    const mockTitle = 'Example Title';

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
      'stopTrackingEnabled',
    ]);
  });

  it('should not post navigation entry when accessToken is not available', async () => {
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
