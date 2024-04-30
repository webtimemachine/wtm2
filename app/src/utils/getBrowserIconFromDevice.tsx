import { Device } from '../background/interfaces/user-device.interface';
import {
  FaEarthAmericas,
  FaChrome,
  FaFirefox,
  FaEdge,
  FaSafari,
} from 'react-icons/fa6';

export const getBrowserIconFromDevice = (device: Device) => {
  const browserName = device.uaResult?.browser.name;

  if (browserName && browserName === 'Chrome') return FaChrome;
  if (browserName && browserName === 'Firefox') return FaFirefox;
  if (browserName && browserName === 'Safari') return FaSafari;
  if (browserName && browserName === 'Mobile Safari') return FaSafari;
  if (browserName && browserName === 'Edge') return FaEdge;

  return FaEarthAmericas;
};
