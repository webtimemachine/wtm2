import { ManifestV3Export } from '@crxjs/vite-plugin';

type FirefoxManifestV3Export = ManifestV3Export & {
  browser_specific_settings: {
    gecko: {
      id: string;
    };
    gecko_android: {
      id: string;
    };
  };
};

import { baseManifest } from './manifest-base';

export const manifestFirefox: FirefoxManifestV3Export = {
  ...baseManifest,
  browser_specific_settings: {
    gecko: {
      id: '{5790cffd-a2b7-4cb6-ad05-c5b955ddee3e}',
    },
    gecko_android: {
      id: '{5790cffd-a2b7-4cb6-ad05-c5b955ddee3e}',
    },
  },
  background: {
    scripts: ['src/service-workers/background.ts'],
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
      matches: ['*://*/*'],
    },
  ],
} as FirefoxManifestV3Export;
