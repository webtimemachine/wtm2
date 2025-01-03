import { ManifestV3Export } from '@crxjs/vite-plugin';
import { baseManifest } from './manifest-base';

export const manifestIOS: ManifestV3Export = {
  ...baseManifest,
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/content-scripts/content-ios.ts'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
      matches: ['*://*/*'],
      use_dynamic_url: true,
    },
  ],
} as ManifestV3Export;
