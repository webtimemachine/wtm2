import { API_URL } from '../consts.js'

// -- Close Config / Setting button -- //
const closeSettingButton = document.getElementById('close-settings-button');

closeSettingButton.addEventListener('click', function () {
    window.location.replace('./settings.html');
})

// document.addEventListener('DOMContentLoaded', function () {
//     chrome.runtime.sendMessage({ type: "getSettingInfo" }, function (response) {
//         if (response.user_info?.user) { //Display user email connected & backend information
//             const userDiv = document.getElementById('user-connected');
//             userDiv.innerHTML = `User: ${response.user_info.user.email}`

//             const apiDiv = document.getElementById('backend-connected');
//             apiDiv.innerHTML = `Backend API: ${API_URL}`
//         }
//     });
// });
