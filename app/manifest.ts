import { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'WebTM - Vite 2',
  version: '1.0',
  description: 'WebTM - Vite 2',
  permissions: ['tabs', 'activeTab', 'storage', 'scripting'],
  action: {
    default_popup: 'index.html',
  },
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
