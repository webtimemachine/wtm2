import { ManifestV3Export } from '@crxjs/vite-plugin';
import { baseManifest } from './manifest-base';

export const manifestChrome: ManifestV3Export = {
  ...baseManifest,
  background: {
    service_worker: 'src/service-workers/background.ts',
    type: 'module',
  },
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgLY4l2yy0UVFTNou++ZOhphmYXD3xIarS/ESR0JjydDBHwXJiLqOskfhuIV1s7pw9yUOV6GWLYsEBSwnDzVDvRVkwl418mZ/T8YHkxlsraskF2hvVqJku0D3wffYZF17sMC/ZlfT/WWRlt56MPFf9tMpUd3fd9Oe+v5j0eB/XH5XHv2KzE2JIb6FKVpV9wtQCo8ZuF5uMODoxRB/cQVmEQgPWatu44bjDyRdgPyIqVrBaitSNc3dlMiH/X2GRg70F85nGb3ES2Ub+HhSucM4oqiLz/rjWDZGgp5KYYqOUeHrCSC43flv0X0Z4bJ3nf2QPF9JrAGYVgiuuXuzp5ApawIDAQAB',
  web_accessible_resources: [
    {
      resources: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
      matches: ['*://*/*'],
      use_dynamic_url: true,
    },
  ],
} as ManifestV3Export;
