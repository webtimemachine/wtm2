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
      input: {
        content: 'src/content-scripts/content.ts',
        background: 'src/service-workers/background.ts',
        popup: 'index.html',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name][extname]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
