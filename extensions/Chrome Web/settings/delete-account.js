const closeSettingButton = document.getElementById('close-settings-button');

const deleteButton = document.getElementById('delete');

// -- Close Config / Setting button -- //
closeSettingButton.addEventListener('click', function () {
  window.location.replace('./settings.html');
})

// document.addEventListener('DOMContentLoaded', async () => {
//   const getPreferencesRes = await chrome.runtime.sendMessage({ type: "getPreferences" });

//   if (getPreferencesRes.enableNavigationEntryExpiration) {
//     expirationDaysToggle.setAttribute('checked', true)
//     expirationDaysInput.removeAttribute('disabled')
//     expirationDaysInput.value = getPreferencesRes.navigationEntryExpirationInDays
//   }
// });
