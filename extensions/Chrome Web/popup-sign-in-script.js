import { is_user_signed_in, } from './auth.js'

const button = document.querySelector('button');

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  if (email && password) {
    // send message to background script with email and password
    chrome.runtime.sendMessage({
      type: 'login',
      payload: { email, password }
    },
      function (response) {
        if (response.user) {
          window.location.replace('./popup.html');
        }
      })
  } else {
    document.querySelector('#email').placeholder = "Enter an email.";
    document.querySelector('#password').placeholder = "Enter a password.";
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#password').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');
    document.querySelector('#password').classList.add('white_placeholder');
  }
});

//When popup is ready, check if user is already logged in
document.addEventListener('DOMContentLoaded', function () {
  is_user_signed_in(chrome).then((res) => {
    if (res.userStatus) {
      window.location.replace('./popup.html');
    }
  })
});