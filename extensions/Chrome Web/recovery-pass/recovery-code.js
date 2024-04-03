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