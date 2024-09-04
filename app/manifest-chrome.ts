import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestChrome: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.5.9',
  description:
    'WebTM is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers.',
  permissions: ['tabs', 'activeTab', 'storage', 'scripting'],
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
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  web_accessible_resources: [
    {
      resources: ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
      matches: ['*://*/*'],
      use_dynamic_url: true,
    },
  ],
};
