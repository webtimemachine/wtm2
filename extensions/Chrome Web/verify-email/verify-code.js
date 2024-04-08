const baseURL = document.getElementById('baseURL')
const email = document.getElementById('email')

const storageData = await chrome.storage.local.get([
  'verify_email',
  'partialToken',
  'baseURL',
]);

if (storageData.verify_email) {
  baseURL.innerText = `Base URL: ${storageData.baseURL}`
  email.innerText = `Recovery email: ${storageData.verify_email}`
}


const backToLogin = document.getElementById('back-to-login')

backToLogin.addEventListener('click', async () => {
  await chrome.storage.local.set({
    partialToken: null,
    verify_email: null,
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
    const verifyEmailResponse = await chrome.runtime.sendMessage({
      type: 'verifyEmail',
      payload: {
        partialToken: storageData.partialToken,
        userAgent: navigator.userAgent,
        baseURL: storageData.baseURL,
        code: code
      },
    });

    await chrome.storage.local.set({
      partialToken: null,
      verify_email: null,
    });

    if (verifyEmailResponse.user) {
      window.location.replace('../popup.html');
    }
  } else {
    console.log('Error');
  }
});
