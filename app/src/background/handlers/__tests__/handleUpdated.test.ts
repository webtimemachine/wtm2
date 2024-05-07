import { apiClient } from '../../api.client';
import { handleUpdated } from '../handleUpdated';

jest.mock('../../api.client', () => ({
  apiClient: {
    securedFetch: jest.fn(),
  },
}));

describe('handleUpdated', () => {
  it('should handle tab update with access token and complete status', async () => {
    const tabId = 1;
    const changeInfo = { status: 'complete' };
    const tab = {
      url: 'https://example.com',
      title: 'Example Title',
    } as chrome.tabs.Tab;
    const accessToken = 'accessToken123';

    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { accessToken: accessToken };
          }),
        },
      },
      scripting: {
        executeScript: jest
          .fn()
          .mockResolvedValueOnce([
            { result: '<html><body>Content</body></html>' },
          ]),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    await handleUpdated(tabId, changeInfo, tab);

    expect(apiClient.securedFetch).toHaveBeenCalled();
  });

  it('should not make API call if tab URL is Chrome or Google search', async () => {
    (apiClient.securedFetch as jest.Mock).mockReset();
    const tabId = 1;
    const changeInfo = { status: 'complete' };
    const tab = { url: 'chrome://extensions', title: 'Chrome Extensions' };
    const accessToken = 'accessToken123';
    global.chrome = {
      storage: {
        local: {
          get: jest.fn().mockImplementationOnce(() => {
            return { accessToken: accessToken };
          }),
        },
      },
      scripting: {
        executeScript: jest
          .fn()
          .mockResolvedValueOnce([
            { result: '<html><body>Content</body></html>' },
          ]),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    await handleUpdated(tabId, changeInfo, tab as chrome.tabs.Tab);

    expect(apiClient.securedFetch).not.toHaveBeenCalled();
  });

  // Add more test cases to cover other scenarios such as missing access token, script execution errors, etc.
});
