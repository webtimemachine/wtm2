import { Pagination } from './pagination.js';

let paginationData = undefined;
let paginationDataQueries = undefined;
const ITEMS_PER_PAGE = 10;

const sitesList = document.getElementById('sites-list');
const queriesList = document.getElementById('queries-list');
const loaderContainer = document.getElementById('loader-container');

const handleLogoutUser = async () => {
  await chrome.runtime.sendMessage({ type: 'logout' });
  window.location.replace('./popup-sign-in.html');
};

// -- Config / Setting button -- //
const configButton = document.getElementById('config-button');

configButton.addEventListener('click', function () {
  window.location.replace('./settings/settings.html');
});

const onTabChange = async (event) => {
  const tabId = event.target.id.split('-')[0];

  // Remove 'tab-active' class from all tab titles
  document.querySelectorAll('.tab-title').forEach((tab) => {
    tab.classList.remove('tab-active');
  });

  // Add 'tab-active' class to the clicked tab title
  event.target.classList.add('tab-active');

  // Toggle visibility of tab containers
  document.querySelectorAll('.list-container').forEach((container) => {
    container.classList.toggle(
      'visible',
      container.id === `${tabId}-container`,
    );
  });

  // Toggle visibility of pagination containers
  document
    .querySelectorAll('.pagination-container')
    .forEach((paginationDiv) => {
      paginationDiv.classList.toggle(
        'visible-flex',
        paginationDiv.id === `${tabId}-pagination`,
      );
    });
};

// -- Event handling related to tab changes -- //
document.querySelectorAll('.tab-title').forEach((button) => {
  button.addEventListener('click', onTabChange);
});

// -- Input, Semantic checkbox and Search button -- //
const searchInput = document.getElementById('input');
const searchButton = document.getElementById('search-button');
const semanticCheckbox = document.getElementById('semantic-toggle');

// Queries tab
const searchQueryButton = document.getElementById('search-button-query-filter');
const searchQueryInput = document.getElementById('input-query-filter');

const refreshNavigationHistoryList = (getHistoryRes) => {
  loaderContainer.style.display = 'none';
  if (getHistoryRes && getHistoryRes.items?.length) {
    paginationData = new Pagination(getHistoryRes.count, ITEMS_PER_PAGE);

    getHistoryRes.items.forEach(appendHistoryItem);
    //When popup is open, left arrow always is going to be disable
    const leftButton = document.getElementById('left-arrow');
    leftButton.setAttribute('disabled', true);

    if (getHistoryRes.count <= getHistoryRes.limit) {
      const rightButton = document.getElementById('right-arrow');
      rightButton.setAttribute('disabled', true);
    } else {
      rightButton.removeAttribute('disabled');
    }

    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
  } else {
    emptyHistoryList(getHistoryRes?.query);
  }
};

const refreshNavigationQueryList = (getQueryRes) => {
  loaderContainer.style.display = 'none';
  if (getQueryRes && getQueryRes.items?.length) {
    paginationDataQueries = new Pagination(getQueryRes.count, ITEMS_PER_PAGE);
    getQueryRes.items.forEach(appendQueryItem);
    //When popup is open, left arrow always is going to be disable
    const leftButton = document.getElementById('left-arrow-query');
    const rightButton = document.getElementById('right-arrow-query');
    leftButton.setAttribute('disabled', true);

    if (getQueryRes.count <= getQueryRes.limit) {
      rightButton.setAttribute('disabled', true);
    } else {
      rightButton.removeAttribute('disabled');
    }
    const paginationInfo = document.getElementById('pagination-info-query');
    paginationInfo.innerHTML = `${paginationDataQueries.getCurrentPage()} / ${paginationDataQueries.getTotalPages()}`;
  } else {
    emptyQueriesResult();
  }
};


const refreshQueries = async (searchText = '') => {
  const getQueriesRes = await chrome.runtime.sendMessage({
    type: 'getQueries',
    offset: 0,
    limit: ITEMS_PER_PAGE,
    query: searchText,
  });

  if (getQueriesRes.error) {
    handleLogoutUser();
    return;
  }
  refreshNavigationQueryList(getQueriesRes);
}

searchButton.addEventListener('click', async () => {
  const searchText = searchInput.value;
  sitesList.innerHTML = '';
  loaderContainer.style.display = 'block';

  const getHistoryRes = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: 0,
    limit: ITEMS_PER_PAGE,
    search: searchText,
    isSemantic: semanticCheckbox.checked,
  });

  if (getHistoryRes.error) {
    handleLogoutUser();
    return;
  }

  refreshNavigationHistoryList(getHistoryRes);
  // refresh the query tab only if the search is semantic
  if (semanticCheckbox.checked) {
    queriesList.innerHTML = '';
    await refreshQueries()
  }
});

searchQueryButton.addEventListener('click', async () => {
  const searchText = searchQueryInput.value;
  queriesList.innerHTML = '';
  loaderContainer.style.display = 'block';
  await refreshQueries(searchText)
});

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
  const paginationInfo = document.getElementById('pagination-info');
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
  paginationInfo.innerHTML = 'Empty';
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

const openQueryResults = (openIcon, closeIcon, container) => {
  document.querySelectorAll('.results').forEach((element) => {
    element.classList.add('hidden');
  });
  document.querySelectorAll('.close-results-icon').forEach((element) => {
    element.classList.add('hidden');
    element.classList.remove('visible-flex');
  });

  document.querySelectorAll('.open-results-icon').forEach((element) => {
    element.classList.add('visible-flex');
    element.classList.remove('hidden');
  });
  container.classList.toggle('hidden');

  closeIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('visible-flex');
  openIcon.classList.toggle('hidden');
  openIcon.classList.toggle('visible-flex');
};

const closeQueryResults = (icon1, icon2, container) => {
  icon1.classList.toggle('hidden');
  icon1.classList.toggle('visible-flex');
  icon2.classList.toggle('hidden');
  icon2.classList.toggle('visible-flex');
  container.classList.toggle('hidden');
};

// Function to create and append query item to list
const appendQueryItem = (item) => {
  const queryItem = document.createElement('div');
  const queryHeader = document.createElement('div');
  const resultsContainer = document.createElement('div');
  const query = document.createElement('p');
  const openIcon = document.createElement('img');
  const closeIcon = document.createElement('img');

  resultsContainer.classList.add('results', 'hidden');

  openIcon.src = './icons/chevron-down.svg';
  openIcon.alt = 'Open results';
  openIcon.classList.add('visible-flex', 'open-results-icon');
  openIcon.title = 'Show query results';
  closeIcon.src = './icons/chevron-up.svg';
  closeIcon.alt = 'Close results';
  closeIcon.classList.add('hidden', 'close-results-icon');
  closeIcon.title = 'Hide query results';

  openIcon.addEventListener('click', (evt) => {
    openQueryResults(evt.target, closeIcon, resultsContainer);
  });

  closeIcon.addEventListener('click', (evt) => {
    closeQueryResults(evt.target, openIcon, resultsContainer);
  });

  query.textContent = item.query;

  queryHeader.classList.add('query-header');
  queryHeader.appendChild(query);
  queryHeader.appendChild(closeIcon);
  queryHeader.appendChild(openIcon);
  queryItem.appendChild(queryHeader);

  item.results.forEach((result) => {
    const resultContainer = document.createElement('div');
    const anchor = document.createElement('a');
    const urlResult = document.createElement('p');
    urlResult.classList.add('truncate');
    urlResult.textContent = `${new Date(result.navigationDate).toLocaleString()} - ${result.title}`;
    anchor.href = result.url;
    anchor.target = '_blank';
    anchor.appendChild(urlResult);
    resultContainer.appendChild(anchor);
    resultsContainer.appendChild(resultContainer);
    queryItem.appendChild(resultsContainer);
  });
  queriesList.appendChild(queryItem);
};

const emptyQueriesResult = () => {
  //Display text
  const paginationInfo = document.getElementById('pagination-info-query');
  const paragraph = document.createElement('p');
  paragraph.classList.add('no-records');

  paragraph.textContent =
    'No results found.\nStart using the semantic search feature or refine the search term';

  queriesList.appendChild(paragraph);

  //Disable arrow buttons
  const leftButton = document.getElementById('left-arrow-query');
  leftButton.setAttribute('disabled', true);

  const rightButton = document.getElementById('right-arrow-query');
  rightButton.setAttribute('disabled', true);
  paginationInfo.innerHTML = 'Empty';
};

document.addEventListener('DOMContentLoaded', async () => {
  const getHistoryRes = await chrome.runtime.sendMessage({
    type: 'getHistory',
    offset: 0,
    limit: ITEMS_PER_PAGE,
    search: '',
    isSemantic: false,
  });

  if (getHistoryRes && getHistoryRes.error) {
    handleLogoutUser();
    return;
  }

  const getQueriesRes = await chrome.runtime.sendMessage({
    type: 'getQueries',
    offset: 0,
    limit: ITEMS_PER_PAGE,
  });

  if (getQueriesRes && getQueriesRes.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (getHistoryRes && getHistoryRes.items?.length) {
    paginationData = new Pagination(getHistoryRes.count, ITEMS_PER_PAGE);

    getHistoryRes.items.forEach(appendHistoryItem);
    const leftButton = document.getElementById('left-arrow');
    leftButton.setAttribute('disabled', true);
    if (getHistoryRes.count <= getHistoryRes.limit) {
      const rightButton = document.getElementById('right-arrow');
      rightButton.setAttribute('disabled', true);
    }
    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`;
  } else {
    emptyHistoryList(getHistoryRes?.query);
  }
  if (getQueriesRes && getQueriesRes.items?.length) {
    paginationDataQueries = new Pagination(getQueriesRes.count, ITEMS_PER_PAGE);

    getQueriesRes.items.forEach(appendQueryItem);
    const leftButton = document.getElementById('left-arrow-query');
    leftButton.setAttribute('disabled', true);
    if (getQueriesRes.count <= getQueriesRes.limit) {
      const rightButton = document.getElementById('right-arrow-query');
      rightButton.setAttribute('disabled', true);
    }
    const paginationInfo = document.getElementById('pagination-info-query');
    paginationInfo.innerHTML = `${paginationDataQueries.getCurrentPage()} / ${paginationDataQueries.getTotalPages()}`;
  } else {
    emptyQueriesResult();
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
    isSemantic: semanticCheckbox.checked,
  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach(appendHistoryItem);

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
    isSemantic: semanticCheckbox.checked,
  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach(appendHistoryItem);

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
});

// Pagination query
const leftButtonQueries = document.getElementById('left-arrow-query');

leftButtonQueries.addEventListener('click', async () => {
  paginationDataQueries.prevPage();
  queriesList.innerHTML = '';
  loaderContainer.style.display = 'block';

  const response = await chrome.runtime.sendMessage({
    type: 'getQueries',
    offset: paginationDataQueries.getStartIndex(),
    limit: ITEMS_PER_PAGE,
  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach(appendQueryItem);

    if (response.offset == 0) {
      const leftButton = document.getElementById('left-arrow-query');
      leftButton.setAttribute('disabled', true);
    }

    //When user move to the previous page, right arrow always is going to be enable
    const rightButton = document.getElementById('right-arrow-query');
    rightButton.removeAttribute('disabled');

    const paginationInfo = document.getElementById('pagination-info-query');
    paginationInfo.innerHTML = `${paginationDataQueries.getCurrentPage()} / ${paginationDataQueries.getTotalPages()}`;
  }
});

const rightButtonQueries = document.getElementById('right-arrow-query');

rightButtonQueries.addEventListener('click', async () => {
  paginationDataQueries.nextPage();
  queriesList.innerHTML = '';
  loaderContainer.style.display = 'block';

  const response = await chrome.runtime.sendMessage({
    type: 'getQueries',
    offset: paginationDataQueries.getStartIndex(),
    limit: ITEMS_PER_PAGE,
  });

  if (response.error) {
    handleLogoutUser();
    return;
  }

  loaderContainer.style.display = 'none';
  if (response && response.items?.length) {
    response.items.forEach(appendQueryItem);
    //When user move to the next page, left arrow always is going to be enable
    const leftButton = document.getElementById('left-arrow-query');
    leftButton.removeAttribute('disabled');

    if (response.limit + response.offset >= response.count) {
      const rightButton = document.getElementById('right-arrow-query');
      rightButton.setAttribute('disabled', true);
    }

    const paginationInfo = document.getElementById('pagination-info-query');
    paginationInfo.innerHTML = `${paginationDataQueries.getCurrentPage()} / ${paginationDataQueries.getTotalPages()}`;
  }
});
