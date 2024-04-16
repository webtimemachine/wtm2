// -- Close Config / Setting button -- //
const closeSettingButton = document.getElementById('close-settings-button');

closeSettingButton.addEventListener('click', function () {
  window.location.replace('./settings.html');
})

const getCancelButton = (session) => {
  const cancelIcon = document.createElement('img');
  cancelIcon.src = '../icons/xmark.svg';
  cancelIcon.alt = 'Cancel action';
  cancelIcon.width = 15
  cancelIcon.height = 15
  cancelIcon.id = `cancel-session-id-${session.id}`
  cancelIcon.addEventListener('click', () => restoreRow(session));

  return cancelIcon
}

const getEditButton = (session) => {
  const editIcon = document.createElement('img');

  editIcon.src = '../icons/pencil.svg';
  editIcon.alt = 'Edit device alias';
  editIcon.width = 15
  editIcon.height = 15
  editIcon.id = `edit-session-id-${session.id}`
  editIcon.addEventListener('click', () => replaceRowForEditableRow(session));

  return editIcon
}

const getDeleteButton = (session, deleteFunction) => {
  const deleteIcon = document.createElement('img');
  deleteIcon.src = '../icons/xmark.svg';
  deleteIcon.alt = 'Delete record';
  deleteIcon.width = 15
  deleteIcon.height = 15
  deleteIcon.id = `delete-session-id-${session.id}`
  deleteIcon.addEventListener('click', deleteFunction);
  deleteIcon.style.marginLeft = '10px'

  return deleteIcon
}

const activeSessionsList = document.getElementById('active-sessions-list');

const appendActiveSessionItem = (session, deleteFunction) => {
  var listItem = document.createElement('div');
  var paragraph = document.createElement('p');
  var actionContainer = document.createElement('div');
  const editIcon = getEditButton(session)

  let name = session.userDevice.deviceAlias || `${session.userDevice.device.uaResult.device.model} - ${session.userDevice.device.uaResult.browser.name}`

  if (session.userDevice.isCurrentDevice) {
    name = `${name} (current)`
  }

  paragraph.textContent = name;
  paragraph.classList.add('truncate');
  paragraph.id = `deviceName-session-id-${session.id}`

  listItem.appendChild(paragraph);

  actionContainer.id = `action-container-${session.id}`
  actionContainer.classList.add('action-container')
  actionContainer.appendChild(editIcon);

  if (!session.userDevice.isCurrentDevice) {
    const deleteIcon = getDeleteButton(session, deleteFunction)
    actionContainer.appendChild(deleteIcon);
  }

  listItem.appendChild(actionContainer);
  activeSessionsList.appendChild(listItem);
};

const logoutSession = async (sessionId) => {

  await chrome.runtime.sendMessage({ type: "logoutSessionBySessionId", sessionIds: [sessionId] });
  window.location.reload();
}

const replaceRowForEditableRow = (session) => {
  const p = document.getElementById(`deviceName-session-id-${session.id}`)
  const actionContainer = document.getElementById(`action-container-${session.id}`)

  if (p) {
    const input = document.createElement('input');
    input.id = `input-session-id-${session.id}`
    input.value = p.textContent.split(' (current)')[0]
    p.replaceWith(input);
  }

  if (actionContainer) {
    actionContainer.innerHTML = ''

    const cancelIcon = getCancelButton(session)

    actionContainer.appendChild(cancelIcon)
  }
}


const restoreRow = (session) => {
  const input = document.getElementById(`input-session-id-${session.id}`)

  if (input) {
    let name = session.userDevice.deviceAlias || `${session.userDevice.device.uaResult.device.model} - ${session.userDevice.device.uaResult.browser.name}`

    if (session.userDevice.isCurrentDevice) {
      name = `${name} (current)`
    }

    const paragraph = document.createElement('p');
    paragraph.textContent = name;
    paragraph.classList.add('truncate');
    paragraph.id = `deviceName-session-id-${session.id}`
    input.replaceWith(paragraph);
  }

  const actionContainer = document.getElementById(`action-container-${session.id}`)
  if (actionContainer) {
    actionContainer.innerHTML = ''

    const editIcon = getEditButton(session)

    actionContainer.appendChild(editIcon);

    if (!session.userDevice.isCurrentDevice) {
      const deleteIcon = getDeleteButton(session, () => logoutSession(session.id))

      actionContainer.appendChild(deleteIcon);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const getActiveSessionsRes = await chrome.runtime.sendMessage({ type: "getActiveSessions" });

  if (getActiveSessionsRes.length) {
    for (let i = 0; i < getActiveSessionsRes.length; i++) {
      const session = getActiveSessionsRes[i]

      appendActiveSessionItem(session, () => logoutSession(session.id))
    }
  }
});