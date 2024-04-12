import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

import {crx} from '@crxjs/vite-plugin';
import {ManifestV3Export} from '@crxjs/vite-plugin';

import manifestJSON from './manifest.json';

const manifest: ManifestV3Export = manifestJSON as ManifestV3Export;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({manifest})],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
});
