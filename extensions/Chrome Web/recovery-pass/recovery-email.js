import { API_URL } from '../consts.js';
import { getStorageData } from '../auth.js';

const baseUrlInput = document.querySelector('#baseURL');
getStorageData(chrome).then((storageData) => {
  baseUrlInput.value = storageData?.baseURL || API_URL;
});

document.querySelector('#submit').addEventListener('click', async (event) => {
  event.preventDefault();

  const baseURL = baseUrlInput.value;
  const email = document.querySelector('#email').value;

  console.log(baseURL);
  console.log(email);

  if (email && baseURL) {
    console.log('hola');
    // send message to background script with email and baseURL
    const initiateRecoveryPasswordResponse = await chrome.runtime.sendMessage({
      type: 'initiateRecoveryPassword',
      payload: { email, baseURL },
    });

    await chrome.storage.local.set({
      recovery_flow: true,
      recovery_email: email,
      baseURL: baseURL
    });

    window.location.replace('./recovery-code.html');
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
  }
});
