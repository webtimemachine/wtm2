import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestFirefox: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.3',
  description: 'WebTM',
  browser_specific_settings: {
    gecko: {
      id: '{5790cffd-a2b7-4cb6-ad05-c5b955ddee3e}',
    },
  },
  permissions: ['tabs', 'activeTab', 'storage', 'scripting'],
  action: {
    default_popup: 'index.html',
  },
  host_permissions: ['<all_urls>'],
  icons: {
    '16': 'app-icon.png',
    '32': 'app-icon.png',
    '48': 'app-icon.png',
    '128': 'app-icon.png',
  },
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/content-scripts/content.ts'],
      run_at: 'document_end',
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
} as ManifestV3Export;
