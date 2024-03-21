import { isUserSignedIn } from './auth.js';
import { API_URL } from './consts.js';

const baseUrlInupt = document.querySelector('#baseURL');
baseUrlInupt.value = API_URL;

const signUpLink = document.querySelector('#sign-up-link');
signUpLink.addEventListener('click', () => {
  window.location.replace('./popup-sign-up.html');
});

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  if (email && password) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'login',
        payload: { email, password, userAgent: navigator.userAgent },
      });

      if (response.error) {
        document.querySelector('#login-error').style.display = 'block';
      }

      if (response.user) {
        window.location.replace('./popup.html');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#password').placeholder = 'Enter a password.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#password').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
    document.querySelector('#password').classList.add('white_placeholder');
  }
});

// When popup is ready, check if the user is already logged in
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await isUserSignedIn(chrome);
    if (res.userStatus) window.location.replace('./popup.html');
  } catch (error) {
    console.error('Error occurred:', error);
  }
});
