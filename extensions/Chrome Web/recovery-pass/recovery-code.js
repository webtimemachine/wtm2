const baseURL = document.getElementById('baseURL')
const email = document.getElementById('email')

const storageData = await chrome.storage.local.get([
  'recovery_flow',
  'recovery_email',
  'baseURL',
]);

if (storageData.recovery_flow) {
  baseURL.innerText = `Base URL: ${storageData.baseURL}`
  email.innerText = `Recovery email: ${storageData.recovery_email}`
}


const backToLogin = document.getElementById('back-to-login')

backToLogin.addEventListener('click', async () => {
  await chrome.storage.local.set({
    recovery_flow: false,
    recovery_email: null,
    baseURL: null
  });

  window.location.replace('../popup-sign-in.html');
})

const submitButton = document.querySelector('#submit');

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const code = document.querySelector('#code').value;

  if (email && baseURL && code) {
    // send message to background script with email and baseURL
    const validateRecoveryEmailAndCodeResponse = await chrome.runtime.sendMessage({
      type: 'validateRecoveryEmailAndCode',
      payload: { email, baseURL, code },
    });

    await chrome.storage.local.set({
      recovery_flow: true,
      recovery_email: email,
      baseURL: baseURL,
      recovery_code: code,
      recovery_token: validateRecoveryEmailAndCodeResponse.recoveryToken
    });

    window.location.replace('./change-password.html');
  } else {
    console.log('Error');
  }
});
