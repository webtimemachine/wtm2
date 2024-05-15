import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestChrome: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.5.1',
  description:
    'WebTM is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers. Focusing on providing a solution for integration between Google Chrome, Firefox and Safari iOS.',
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
};
