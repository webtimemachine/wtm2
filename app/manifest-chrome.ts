import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifestChrome: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM - pocReact',
  version: '1.2',
  description: 'WebTM - pocReact',
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
  background: {
    service_worker: 'src/background/background.ts',
  },
};
