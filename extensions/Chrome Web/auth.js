
// Check if user details is saved on browser data
export function is_user_signed_in (chrome) {
  return new Promise(resolve => {
    chrome.storage.local.get(['userStatus', 'user_info'],
      function (response) {
        if (chrome.runtime.lastError) resolve({
          userStatus:
            false, user_info: {}
        })
        resolve(response.userStatus === undefined ?
          { userStatus: false, user_info: {} } :
          {
            userStatus: response.userStatus, user_info:
              response.user_info
          }
        )
      });
  });
}

export async function loginUser (user_info) {
  try {
    const res = {
      status: 200,
      user_info: {
        email: user_info.email,
        name: 'Juan Ignacio'
      }
    }
    return await new Promise(resolve => {
      if (res.status !== 200) resolve('fail');

      chrome.storage.local.set({ userStatus: true, user_info: res.user_info }, function (response) {
        if (chrome.runtime.lastError) resolve('fail');
        resolve(res.user_info);
      });
    });
  } catch (err) {
    resolve('success');
    return console.log(err);
  }
}

export async function logoutUser () {
  chrome.storage.local.set({ userStatus: false, user_info: {} }, function (response) {
    if (chrome.runtime.lastError) resolve('fail');
    resolve('success');
  });
}