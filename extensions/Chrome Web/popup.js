import { Pagination } from './pagination.js';

let paginationData = undefined;
const ITEMS_PER_PAGE = 10;

const handleLogoutUser = async () => {
  await chrome.runtime.sendMessage({ type: 'logout' });
  window.location.replace('./popup-sign-in.html');
};

// -- Config / Setting button -- //
const configButton = document.getElementById('config-button');

document.querySelectorAll('.tab-title').forEach(button => {
    button.onclick = (event) => {
        // Remove 'tab-active' class from all tab titles
        document.querySelectorAll('.tab-title').forEach(tab => {
            tab.classList.remove('tab-active');
        });
        // Add 'tab-active' class to the clicked tab title
        event.target.classList.add('tab-active');


        // Remove 'visible' class from tab containers
        document.querySelectorAll('.list-container').forEach(container => {
            if (container.classList.contains('visible')) {
                container.classList.remove('visible');
            }
            else {
                container.classList.add('visible');
            }
        });
        // Add 'tab-active' class to the clicked tab title
        event.target.classList.add('tab-active');
    }
})


configButton.addEventListener('click', function () {
  window.location.replace('./settings/settings.html');
})

// -- Input and Search button -- //
const searchInput = document.getElementById('input');
const searchButton = document.getElementById('search-button');

const semanticCheckbox = document.getElementById('semantic-toggle');

const refreshNavigationHistoryList = (getHistoryRes) => {
  loaderContainer.style.display = 'none';
  if (getHistoryRes && getHistoryRes.items?.length) {
    paginationData = new Pagination(getHistoryRes.count, ITEMS_PER_PAGE);

    getHistoryRes.items.forEach((record) => {
      appendHistoryItem(record);
    });
    //When popup is open, left arrow always is going to be disable
    const leftButton = document.getElementById('left-arrow');
    leftButton.setAttribute('disabled', true);

    if (getHistoryRes.count <= getHistoryRes.limit) {
      const rightButton = document.getElementById('right-arrow');
      rightButton.setAttribute('disabled', true);
    } else {
      emptyHistoryList();
    }

    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
  } else {
    emptyHistoryList(getHistoryRes?.query);
  }
};

searchButton.addEventListener('click', async () => {
  const searchText = searchInput.value;
  sitesList.innerHTML = '';
  loaderContainer.style.display = 'block';

  const getHistoryRes = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: 0,
    limit: ITEMS_PER_PAGE,
    search: searchText,
    isSemantic: semanticCheckbox.checked
  });

  if (getHistoryRes.error) {
    handleLogoutUser();
    return;
  }

  refreshNavigationHistoryList(getHistoryRes);
});

const sitesList = document.getElementById('sites-list');
const loaderContainer = document.getElementById('loader-container');
// Function to create and append history item to list
const appendHistoryItem = (item) => {
  var listItem = document.createElement('div');
  var paragraph = document.createElement('p');
  var deleteIcon = document.createElement('img');
  var anchor = document.createElement('a');

  paragraph.textContent = `${new Date(item.navigationDate).toLocaleString()} - ${item.title}`;
  paragraph.classList.add('truncate');

  deleteIcon.src = './icons/xmark.svg';
  deleteIcon.alt = 'Delete record';
  deleteIcon.addEventListener('click', () => deleteItem(item));

  anchor.href = item.url;
  anchor.target = '_blank';

  anchor.appendChild(paragraph);

  listItem.appendChild(anchor);
  listItem.appendChild(deleteIcon);

  sitesList.appendChild(listItem);
};

const emptyHistoryList = (query) => {
  //Display text
  const paragraph = document.createElement('p');
  paragraph.classList.add('no-records');

  paragraph.textContent = query
    ? 'No results found. Try different search terms!'
    : 'Start browsing to populate your history!';

  sitesList.appendChild(paragraph);

  //Disable arrow buttons
  const leftButton = document.getElementById('left-arrow');
  leftButton.setAttribute('disabled', true);

  const rightButton = document.getElementById('right-arrow');
  rightButton.setAttribute('disabled', true);
};

const deleteItem = async (item) => {
  const searchText = searchInput.value;
  sitesList.innerHTML = '';
  loaderContainer.style.display = 'block';

  const getHistoryRes = await chrome.runtime.sendMessage({
    type: 'deleteHistoryEntry',
    item,
    offset: 0,
    limit: ITEMS_PER_PAGE,
    search: searchText,
  });

  if (getHistoryRes.error) {
    handleLogoutUser();
    return;
  }

  refreshNavigationHistoryList(getHistoryRes);
};

document.addEventListener('DOMContentLoaded', async () => {
  const getHistoryRes = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: 0,
    limit: ITEMS_PER_PAGE,
    search: '',
    isSemantic: false
  });

  if (getHistoryRes && getHistoryRes.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (getHistoryRes && getHistoryRes.items?.length) {
    paginationData = new Pagination(getHistoryRes.count, ITEMS_PER_PAGE);

    getHistoryRes.items.forEach((record) => {
      appendHistoryItem(record);
    });

    if (getHistoryRes.count <= getHistoryRes.limit) {
      const rightButton = document.getElementById('right-arrow');
      rightButton.setAttribute('disabled', true);
    }
    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
  } else {
    emptyHistoryList(getHistoryRes?.query);
  }
});

// Pagination
const leftButton = document.getElementById('left-arrow');

leftButton.addEventListener('click', async () => {
  paginationData.prevPage();
  sitesList.innerHTML = '';
  loaderContainer.style.display = 'block';
  const searchText = searchInput.value;

  const response = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: paginationData.getStartIndex(),
    limit: ITEMS_PER_PAGE,
    search: searchText,
    isSemantic: semanticCheckbox.checked
  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach((record) => {
      appendHistoryItem(record);
    });

    if (response.error) {
      handleLogoutUser();
      return;
    }

    loaderContainer.style.display = 'none';
    if (response && response.items?.length) {
      response.items.forEach((record) => {
        appendHistoryItem(record);
      });

      if (response.offset == 0) {
        const leftButton = document.getElementById('left-arrow');
        leftButton.setAttribute('disabled', true);
      }

      //When user move to the previous page, right arrow always is going to be enable
      const rightButton = document.getElementById('right-arrow');
      rightButton.removeAttribute('disabled');

      const paginationInfo = document.getElementById('pagination-info');
      paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
    }
  }
});

const rightButton = document.getElementById('right-arrow');

rightButton.addEventListener('click', async () => {
  paginationData.nextPage();
  sitesList.innerHTML = '';
  loaderContainer.style.display = 'block';
  const searchText = searchInput.value;

  const response = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: paginationData.getStartIndex(),
    limit: ITEMS_PER_PAGE,
    search: searchText,
    isSemantic: semanticCheckbox.checked

  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach((record) => {
      appendHistoryItem(record);
    });

    if (response.error) {
      handleLogoutUser();
      return;
    }

    loaderContainer.style.display = 'none';
    if (response && response.items?.length) {
      response.items.forEach((record) => {
        appendHistoryItem(record);
      });

      //When user move to the next page, left arrow always is going to be enable
      const leftButton = document.getElementById('left-arrow');
      leftButton.removeAttribute('disabled');

      if (response.limit + response.offset >= response.count) {
        const rightButton = document.getElementById('right-arrow');
        rightButton.setAttribute('disabled', true);
      }

      const paginationInfo = document.getElementById('pagination-info');
      paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
    }
  }
});
