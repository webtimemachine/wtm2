import { Device } from 'wtm-lib/interfaces';
import {
  FaWindows,
  FaLinux,
  FaApple,
  FaMobile,
  FaLaptop,
  FaAndroid,
} from 'react-icons/fa6';

export const getOSIconFromDevice = (device: Device) => {
  const osName = device.uaResult?.os.name;

  if (osName && osName === 'Windows') return FaWindows;
  if (osName && osName === 'Mac OS') return FaApple;
  if (osName && osName === 'Linux') return FaLinux;
  if (osName && osName === 'iOS') return FaMobile;
  if (osName && osName === 'Android') return FaAndroid;

  return FaLaptop;
};
