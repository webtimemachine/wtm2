import { API_URL } from '../consts.js'

// -- Close Config / Setting button -- //
const closeSettingButton = document.getElementById('close-settings-button');

closeSettingButton.addEventListener('click', function () {
    window.location.replace('../popup.html');
});

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'logout' });
    window.location.replace('../popup-sign-in.html');
});

document.addEventListener('DOMContentLoaded', async () => {
    const storageData = await chrome.runtime.sendMessage({
        type: 'getSettingInfo',
    });
    if (storageData.user_info?.user) {
        //Display user email connected & backend information
        const userDiv = document.getElementById('user-connected');
        userDiv.innerHTML = `User: ${storageData.user_info.user.email}`;

        const apiDiv = document.getElementById('backend-connected');
        apiDiv.innerHTML = `Backend API: ${storageData.baseURL || API_URL}`;
    }
});

const expDateOption = document.getElementById('preferences-button');

expDateOption.addEventListener('click', function () {
    window.location.replace('./preferences.html');
})
