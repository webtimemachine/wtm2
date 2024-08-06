import { Device } from '../interfaces/user-device.interface';

export type SupportedBrowser =
  | 'Chrome'
  | 'Firefox'
  | 'Safari'
  | 'Edge'
  | 'Brave'
  | 'Unknown';

export const getSupportedBrowserFromDevice = (
  device: Device,
): SupportedBrowser => {
  const browserName = device.uaResult?.browser.name;
  let userAgentData: any = {};

  try {
    userAgentData = JSON.parse(device?.userAgentData || '{}');
  } catch (error) {
    console.error(
      'Error while parsing userAgentData',
      device?.userAgentData,
      error,
    );
  }

  if (device?.userAgentData?.includes('Brave')) {
    console.log({ device, userAgentData });
  }

  if (
    userAgentData &&
    userAgentData?.brands?.some((elem: any) => elem?.brand == 'Brave')
  )
    return 'Brave';
  if (browserName && browserName === 'Chrome') return 'Chrome';
  if (browserName && browserName === 'Firefox') return 'Firefox';
  if (browserName && browserName === 'Safari') return 'Safari';
  if (browserName && browserName === 'Mobile Safari') return 'Safari';
  if (browserName && browserName === 'Edge') return 'Edge';

  return 'Unknown';
};
