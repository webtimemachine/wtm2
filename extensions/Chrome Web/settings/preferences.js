import { API_URL } from '../consts.js'

const expirationDaysToggle = document.getElementById('expiration-days-toggle');
const expirationDaysInput = document.getElementById('expiration-days');
const closeSettingButton = document.getElementById('close-settings-button');
const submitButton = document.getElementById('submit');

// -- Close Config / Setting button -- //
closeSettingButton.addEventListener('click', function () {
  window.location.replace('./settings.html');
})

document.addEventListener('DOMContentLoaded', async () => {
  const getPreferencesRes = await chrome.runtime.sendMessage({ type: "getPreferences" });

  if (getPreferencesRes.enableNavigationEntryExpiration) {
    expirationDaysToggle.setAttribute('checked', true)
    expirationDaysInput.removeAttribute('disabled')
    expirationDaysInput.value = getPreferencesRes.navigationEntryExpirationInDays
  }
});

expirationDaysToggle.addEventListener('change', function () {
  if (this.checked) {
    expirationDaysInput.removeAttribute('disabled')
  } else {
    expirationDaysInput.setAttribute('disabled', true)
    expirationDaysInput.value = ''
  }
})

submitButton.addEventListener('click', () => {
  if (expirationDaysToggle.checked && !expirationDaysInput.value) {
    expirationDaysInput.style.border = '1px solid red'
    return
  }

  chrome.runtime.sendMessage({
    type: "setPreferences", payload: {
      enableNavigationEntryExpiration: expirationDaysToggle.checked,
      navigationEntryExpirationInDays: parseInt(expirationDaysInput.value)
    }
  });
})

expirationDaysInput.addEventListener('change', () => {
  expirationDaysInput.style.border = 'none'
})
