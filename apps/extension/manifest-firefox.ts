import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestFirefox: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.6.5',
  description:
    'WebTM is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers.',
  browser_specific_settings: {
    gecko: {
      id: '{5790cffd-a2b7-4cb6-ad05-c5b955ddee3e}',
    },
  },
  permissions: ['tabs', 'activeTab', 'storage', 'scripting', 'nativeMessaging'],
  action: {
    default_popup: 'index.html',
  },
  host_permissions: ['<all_urls>'],
  icons: {
    '16': 'app-icon-16.png',
    '32': 'app-icon-32.png',
    '48': 'app-icon-48.png',
    '128': 'app-icon-128.png',
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
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/content-scripts/content.ts'],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  },
} as ManifestV3Export;
