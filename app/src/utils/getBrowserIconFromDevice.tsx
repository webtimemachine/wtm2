import { Device } from 'wtm-lib/interfaces';
import {
  FaEarthAmericas,
  FaChrome,
  FaFirefox,
  FaEdge,
  FaSafari,
  FaBrave,
  FaApple,
} from 'react-icons/fa6';
import { getSupportedBrowserFromDevice } from '.';

export const getBrowserIconFromDevice = (device: Device) => {
  const supportedBrowser = getSupportedBrowserFromDevice(device);

  switch (supportedBrowser) {
    case 'Chrome':
      return FaChrome;

    case 'Firefox':
      return FaFirefox;

    case 'Safari':
      return FaSafari;

    case 'Edge':
      return FaEdge;

    case 'Brave':
      return FaBrave;

    case 'iOS App':
      return FaApple;

    case 'Unknown':
      return FaEarthAmericas;
  }
};
