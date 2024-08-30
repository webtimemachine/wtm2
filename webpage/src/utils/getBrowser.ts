export enum BROWSERS {
  FIREFOX = 'Mozilla Firefox',
  SAMSUNG = 'Samsung Internet',
  OPERA = 'Opera',
  IE = 'Microsoft Internet Explorer',
  EDGE = 'Microsoft Edge',
  CHROME = 'Google Chrome',
  SAFARI = 'Apple Safari',
  UNKNOWN = 'Unknown',
}

const browserMap: { [key: string]: BROWSERS } = {
  Firefox: BROWSERS.FIREFOX,
  SamsungBrowser: BROWSERS.SAMSUNG,
  OPR: BROWSERS.OPERA,
  Opera: BROWSERS.OPERA,
  Trident: BROWSERS.IE,
  Edge: BROWSERS.EDGE,
  Chrome: BROWSERS.CHROME,
  Safari: BROWSERS.SAFARI,
};

export function getBrowser() {
  if (typeof navigator === 'undefined') {
    return BROWSERS.UNKNOWN;
  }

  const userAgent = navigator.userAgent;

  for (const key in browserMap) {
    if (userAgent.includes(key)) {
      return browserMap[key];
    }
  }

  return BROWSERS.UNKNOWN;
}
