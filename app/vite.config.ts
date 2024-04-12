import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';

import { manifestChrome } from './manifest-chrome';
import { manifestFirefox } from './manifest-firefox';

const browser = process.env.BROWSER || 'chrome';
const manifest = browser === 'firefox' ? manifestFirefox : manifestChrome;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 3000,
  },
  build: {
    outDir: browser,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
});
