document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;

  if (email && password && confirmPassword) {
    if (password != confirmPassword) {
      document.querySelector('#password-error').style.display = 'block';
      return;
    }

    // send message to background script with email and password
    const response = await chrome.runtime.sendMessage({
      type: 'signUp',
      payload: { email, password },
    });

    if (response?.error) {
      // document.querySelector('#login-error').style.display = 'block'
    }

    if (response.success) {
      window.location.replace('./popup-sign-in.html');
    }
  } else {
    document.querySelector('#email').placeholder = 'Enter an email.';
    document.querySelector('#email').style.backgroundColor = 'red';
    document.querySelector('#email').classList.add('white_placeholder');

    document.querySelector('#password').placeholder = 'Enter a password.';
    document.querySelector('#password').style.backgroundColor = 'red';
    document.querySelector('#password').classList.add('white_placeholder');

    document.querySelector('#confirm-password').placeholder =
      'Enter the same password.';
    document.querySelector('#confirm-password').style.backgroundColor = 'red';
    document
      .querySelector('#confirm-password')
      .classList.add('white_placeholder');
  }
});
