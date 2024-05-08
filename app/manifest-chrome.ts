import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestChrome: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM',
  version: '1.3',
  description: 'WebTM',
  permissions: ['tabs', 'activeTab', 'storage', 'scripting', 'webRequest'],
  action: {
    default_popup: 'index.html',
  },
  host_permissions: ['<all_urls>'],
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/background/commonscript.ts', 'src/background/contentscript.ts'],
      run_at: 'document_start',
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  icons: {
    '16': 'app-icon.png',
    '32': 'app-icon.png',
    '48': 'app-icon.png',
    '128': 'app-icon.png',
  },
  background: {
    service_worker: 'src/background/background.ts',
    persistent: false,
  },
};
