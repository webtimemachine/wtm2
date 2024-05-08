let port;
const INTERNAL_TESTAWAKE_PORT = 'CT_Internal_awake_test';

// ---------------------------------------------------------------------------
// Waking up the ServiceWorker
// ---------------------------------------------------------------------------
export function awakeServiceWorker() {
  console.log('awakeServiceWorker');
  port = chrome.runtime.connect({ name: INTERNAL_TESTAWAKE_PORT });
  console.log('awakeServiceWorker port: ', port);
  port.onDisconnect.addListener(() => {
    console.log('Service Worker asked to disconnect');
  });

  port.onMessage.addListener((msg) => {
    console.log(`Message from service worker: ${msg}`);
  });
}
// ---------------------------------------------------------------------------
