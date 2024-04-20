class ApiClient {
  async fetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
    const { serverUrl, accessToken } = await chrome.storage.local.get([
      'serverUrl',
      'accessToken',
    ]);

    if (accessToken) {
      init = {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
    }

    return fetch(new URL(endpoint, serverUrl), init);
  }
}

export const apiClient: ApiClient = new ApiClient();
