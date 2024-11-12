import { ManifestV3Export } from '@crxjs/vite-plugin';

export const baseManifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.7.0',
  description:
    'WebTM is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers.',
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
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/content-scripts/content.ts'],
      run_at: 'document_end',
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  },
} as ManifestV3Export;
