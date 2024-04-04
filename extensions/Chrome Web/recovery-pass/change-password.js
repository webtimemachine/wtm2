const baseURL = document.getElementById('baseURL')
const email = document.getElementById('email')

const storageData = await chrome.storage.local.get([
  'recovery_flow',
  'recovery_email',
  'baseURL',
  'recovery_token'
]);

if (storageData.recovery_flow) {
  baseURL.innerText = `Base URL: ${storageData.baseURL}`
  email.innerText = `Recovery email: ${storageData.recovery_email}`
}

const submitButton = document.querySelector('#submit');

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;

  if (password && confirmPassword && password === confirmPassword) {
    // send message to background script with email and baseURL
    await chrome.runtime.sendMessage({
      type: 'completeRecoveryPassword',
      payload: {
        password,
        confirmPassword,
        userAgent: navigator.userAgent,
        recoveryToken: storageData.recovery_token,
        baseURL: storageData.baseURL
      },
    });

    await chrome.storage.local.set({
      recovery_flow: false,
      recovery_email: null,
      baseURL: null,
      recovery_code: null,
      recovery_token: null
    });

    window.location.replace('../popup-sign-in.html');
  } else {
    console.log('Error');
  }
});
