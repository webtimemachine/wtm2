export const updateIcon = (isLoggedIn: boolean) => {
  const iconPath = isLoggedIn
    ? {
        '16': 'app-icon-16.png',
        '32': 'app-icon-32.png',
        '48': 'app-icon-48.png',
        '128': 'app-icon-128.png',
      }
    : {
        '16': 'app-icon-grayscale-16.png',
        '32': 'app-icon-grayscale-32.png',
        '48': 'app-icon-grayscale-48.png',
        '128': 'app-icon-grayscale-128.png',
      };

  chrome.action.setIcon({ path: iconPath });
};
