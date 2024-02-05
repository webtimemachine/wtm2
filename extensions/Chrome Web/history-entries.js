import { API_URL } from './consts.js';

export async function saveHistoryEntry (user_info, payload) {
  try {

    const body = JSON.stringify(payload)

    return await fetch(`${API_URL}/api/navigation-entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      },
      body: body
    })
  } catch (err) {
    return console.log(err);
  }
}

export async function getHistoryEntries (user_info) {
  try {
    const resp = await fetch(`${API_URL}/api/navigation-entry`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.accessToken}`
      }
    })

    const response = await resp.json()

    return response
  } catch (err) {
    return console.log(err);
  }
}
