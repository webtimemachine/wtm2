const baseURL = document.getElementById('baseURL');
const email = document.getElementById('email');

const storageData = await chrome.storage.local.get([
  'verify_email',
  'partialToken',
  'baseURL',
]);

if (storageData.verify_email) {
  baseURL.innerText = `Base URL: ${storageData.baseURL}`;
  email.innerText = `Recovery email: ${storageData.verify_email}`;
}

const backToLogin = document.getElementById('back-to-login');
backToLogin.addEventListener('click', async () => {
  await chrome.storage.local.set({
    partialToken: null,
    verify_email: null,
  });

  window.location.replace('../popup-sign-in.html');
});

const emailSentMessage = document.getElementById('email-sent-message');
const resendCode = document.getElementById('resend-code');

resendCode.addEventListener('click', async () => {
  const resendCodeResponse = await chrome.runtime.sendMessage({
    type: 'resendCode',
    payload: {
      partialToken: storageData.partialToken,
      baseURL: storageData.baseURL,
    },
  });
  if (
    resendCodeResponse &&
    !resendCodeResponse?.error &&
    resendCodeResponse.message
  ) {
    emailSentMessage.classList.remove('hidden');
  }
});

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
        code: code,
      },
    });

    if (verifyEmailResponse.error) {
      document.querySelector('#verify-error').style.display = 'block';
    }

    if (verifyEmailResponse.user) {
      await chrome.storage.local.set({
        partialToken: null,
        verify_email: null,
      });

      window.location.replace('../popup.html');
    }
  } else {
    console.log('Error');
  }
});
