const closeSettingButton = document.getElementById('close-settings-button');

const deleteButton = document.getElementById('delete');

// -- Close Config / Setting button -- //
closeSettingButton.addEventListener('click', function () {
  window.location.replace('./settings.html');
})

deleteButton.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({
    type: "deleteUserAccount"
  });

  await chrome.runtime.sendMessage({ type: 'logout' });
  window.location.replace('../popup-sign-in.html');
})