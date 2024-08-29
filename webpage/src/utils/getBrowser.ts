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

export function getBrowser() {
  if (typeof navigator === 'undefined') {
    return BROWSERS.UNKNOWN;
  }

  const userAgent = navigator.userAgent;
  let browserName = BROWSERS.UNKNOWN;

  if (userAgent.indexOf('Firefox') > -1) {
    browserName = BROWSERS.FIREFOX;
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = BROWSERS.SAMSUNG;
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = BROWSERS.OPERA;
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = BROWSERS.IE;
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = BROWSERS.EDGE;
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = BROWSERS.CHROME;
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = BROWSERS.SAFARI;
  }

  return browserName;
}
