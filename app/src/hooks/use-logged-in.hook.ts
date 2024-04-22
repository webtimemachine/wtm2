export const useIsLoggedIn = () => {
  const isLoggedIn = async (): Promise<boolean> => {
    const tokens = await chrome.storage.local.get([
      'accessToken',
      'refreshToken',
    ]);

    const { accessToken, refreshToken } = tokens;
    return (accessToken ?? false) && (refreshToken ?? false);
  };

  return { isLoggedIn };
};
