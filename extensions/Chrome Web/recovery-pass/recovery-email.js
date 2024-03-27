import { API_URL } from '../consts.js';
import { getStorageData } from '../auth.js';

getStorageData(chrome).then((storageData) => {
  const baseUrlInput = document.querySelector('#baseURL');
  baseUrlInput.value = storageData?.baseURL || API_URL;
});

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const baseURL = document.querySelector('#baseURL').value;
  const email = document.querySelector('#email').value;

  if (email && baseURL) {

    // send message to background script with email and password
    // const response = await chrome.runtime.sendMessage({
    //   type: 'signUp',
    //   payload: { email, password, baseURL },
    // });

    if (response?.error) {
      // document.querySelector('#login-error').style.display = 'block'
    }

    if (response.success) {
      // window.location.replace('./popup-sign-in.html');
    }
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
  }
});
