import { ManifestV3Export } from '@crxjs/vite-plugin';
import { baseManifest } from './manifest-base';

export const manifestChrome: ManifestV3Export = {
  ...baseManifest,
  background: {
    service_worker: 'src/service-workers/background.ts',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
      matches: ['*://*/*'],
      use_dynamic_url: true,
    },
  ],
} as ManifestV3Export;
