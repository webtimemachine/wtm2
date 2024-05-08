import {
  handleGetVersion,
  handleLogin,
  handleUpdated,
  handleGetNavigationEntries,
  handleGetPreferences,
  handleUpdatePreferences,
  handleSignUp,
  handleResendCode,
  handleVerifyCode,
  handleGetActiveSessions,
  handleCloseActiveSession,
  handleUpdateDeviceAlias,
  handleConfirmDeleteAccount,
  handleRecoverPassword,
  handleValidateRecoveryCode,
  handleRestorePassword,
  handleDeleteNavigationEntry,
} from './handlers';
import { BackgroundMessageType } from './interfaces';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    handleUpdated(tabId, changeInfo, tab);
  } catch (error) {
    console.error(`Unexpected Error in tabs onUpdated:`, error);
  }
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  try {
    const type: BackgroundMessageType = request.type;

    switch (type) {
      case 'get-version':
        handleGetVersion(sendResponse, request?.payload);
        return true;
      case 'login':
        handleLogin(sendResponse, request?.payload);
        return true;
      case 'get-navigation-entries':
        handleGetNavigationEntries(sendResponse, request?.payload);
        return true;
      case 'update-preferences':
        handleUpdatePreferences(sendResponse, request?.payload);
        return true;
      case 'get-user-preferences':
        handleGetPreferences(sendResponse, request?.payload);
        return true;
      case 'get-active-sessions':
        handleGetActiveSessions(sendResponse, request?.payload);
        return true;
      case 'close-active-session':
        handleCloseActiveSession(sendResponse, request?.payload);
        return true;
      case 'update-device-alias':
        handleUpdateDeviceAlias(sendResponse, request?.payload);
        return true;
      case 'sign-up':
        handleSignUp(sendResponse, request?.payload);
        return true;
      case 'resend-code':
        handleResendCode(sendResponse, request?.payloadest);
        return true;
      case 'verify-code':
        handleVerifyCode(sendResponse, request?.payload);
        return true;
      case 'confirm-delete-account':
        handleConfirmDeleteAccount(sendResponse, request?.payload);
        return true;
      case 'recover-password':
        handleRecoverPassword(sendResponse, request?.payload);
        return true;
      case 'validate-recovery-code':
        handleValidateRecoveryCode(sendResponse, request?.payload);
        return true;
      case 'restore-password':
        handleRestorePassword(sendResponse, request?.payload);
        return true;
      case 'delete-navigation-entry':
        handleDeleteNavigationEntry(sendResponse, request?.payload);
        return true;

      default:
        return false;
    }
  } catch (error) {
    console.error(`Unexpected Error onMessage ${request?.type}:`, error);
    sendResponse({ error: 'Unexpected Error onMessage' });
  }
});

console.log(
  `-------- >>> ${convertNoDate(Date.now())} UTC - Service Worker with HIGHLANDER: waiting to be awakened <<< --------`,
);

const INTERNAL_TESTALIVE_PORT = 'CT_Internal_alive_test';
const INTERNAL_TESTAWAKE_PORT = 'CT_Internal_awake_test';

//const startSeconds = 1;
const nextSeconds = 25;
const SECONDS = 1000;

let alivePort: chrome.runtime.Port | null = null;
let isFirstStart = true;
let isAlreadyAwake = false;
let timer;
let firstCall: number;
let lastCall: number;
let wakeup: string | number | NodeJS.Timeout | undefined;

// HIGHLANDER
async function Highlander() {
  const now = Date.now();
  const age = now - firstCall;
  lastCall = now;

  console.log(
    `(DEBUG Highlander) ------< ROUND >------ time elapsed from first start: ${convertNoDate(age)}`,
  );
  if (alivePort == null) {
    alivePort = chrome.runtime.connect({ name: INTERNAL_TESTALIVE_PORT });

    alivePort.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        //console.log(`(DEBUG Highlander) Expected disconnect error. ServiceWorker status should be still RUNNING.`);
      } else {
        console.log(`(DEBUG Highlander): port disconnected`);
      }

      alivePort = null;
    });
  }

  if (alivePort) {
    alivePort.postMessage({ content: 'ping' });

    if (chrome.runtime.lastError) {
      console.log(
        `(DEBUG Highlander): postMessage error: ${chrome.runtime.lastError.message}`,
      );
    } else {
      //console.log(`(DEBUG Highlander): "ping" sent through ${alivePort.name} port`)
    }
  }

  setTimeout(() => {
    nextRound();
  }, 100);
}

function convertNoDate(long: string | number | Date) {
  const dt = new Date(long).toISOString();
  return dt.slice(-13, -5); // HH:MM:SS only
}

function nextRound() {
  if (isFirstStart) {
    isFirstStart = false;
    clearInterval(wakeup);
    timer = nextSeconds * SECONDS;
    wakeup = setInterval(Highlander, timer);
  }
  console.log(
    `(DEBUG Highlander): Next round in ${nextSeconds} seconds to maintain Service Worker alive`,
  );
}

// --------------------------------------------------------------------------------------
// Local pump on port INTERNAL_TESTAWAKE_PORT.
// Content scripts attempts to awake this Service Worker.
// --------------------------------------------------------------------------------------
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== INTERNAL_TESTAWAKE_PORT) return;

  console.log(
    `>>>>> Connection from script at ${convertNoDate(Date.now())} <<<<<`,
  );

  if (isAlreadyAwake == false) {
    // Starts Highlander
    isAlreadyAwake = true;
    firstCall = Date.now();
    //timer = startSeconds*SECONDS;
    timer = 300;
    isFirstStart = true;
    wakeup = setInterval(Highlander, timer);
    console.log(
      `-------- >>> Highlander has been started at ${convertNoDate(Date.now())}`,
    );
  } else {
    const next = nextSeconds * SECONDS - (Date.now() - lastCall);
    console.log(
      `***** Highlander is already running. Next ROUND in ${convertNoDate(next)} ( ${(next / 1000) | 0} seconds )`,
    );
  }

  port.onDisconnect.addListener(() => {
    console.log('Script asked to disconnect');
  });

  port.onMessage.addListener((msg) => {
    console.log(`Message from script: ${msg}`);
  });

  // Disconnect the port connected with content script.
  // Connection is useless as Service Worker will continue to stay awake because of running Highlander function.
  setTimeout(swDisconnect, 1000, port);
});

function swDisconnect(port: { disconnect: () => void }) {
  port.disconnect();
}

// --------------------------------------------------------------------------------------
