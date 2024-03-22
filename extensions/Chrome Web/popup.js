import { Pagination } from './pagination.js'

let paginationData = undefined
const ITEMS_PER_PAGE = 10;

// -- Logout button -- //
function handleLogoutUser () {
    chrome.runtime.sendMessage({ type: "logout" }, function (response) {
        window.location.replace('./popup-sign-in.html');
    });
}

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', function () {
    handleLogoutUser()
})

// -- Config / Setting button -- //
const configButton = document.getElementById('config-button');

configButton.addEventListener('click', function () {
    window.location.replace('./settings/settings.html');
})

// -- Input and Search button -- //
const input = document.getElementById('input');
const searchButton = document.getElementById('search-button');

function refreshNavigationHistoryList (response) {
    loaderContainer.style.display = 'none';
    if (response && response.items?.length) {
        paginationData = new Pagination(response.count, ITEMS_PER_PAGE)

        response.items.forEach(record => {
            appendHistoryItem(record);
        });
        //When popup is open, left arrow always is going to be disable
        const leftButton = document.getElementById('left-arrow');
        leftButton.setAttribute('disabled', true)

        if (response.count <= response.limit) {
            const rightButton = document.getElementById('right-arrow');
            rightButton.setAttribute('disabled', true)
        } else {
            rightButton.removeAttribute('disabled')
        }

        const paginationInfo = document.getElementById('pagination-info');
        paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`
    } else {
        emptyHistoryList()
    }
}

searchButton.addEventListener('click', function () {
    const searchText = input.value
    sitesList.innerHTML = ''
    loaderContainer.style.display = 'block';

    chrome.runtime.sendMessage({ type: "getHistory", offset: 0, limit: ITEMS_PER_PAGE, search: searchText }, function (response) {
        if (response.error) {
            handleLogoutUser()
            return
        }

        refreshNavigationHistoryList(response)
    });
})

const sitesList = document.getElementById('sites-list');
const loaderContainer = document.getElementById('loader-container');
// Function to create and append history item to list
function appendHistoryItem (item) {
    var listItem = document.createElement('div');
    var paragraph = document.createElement('p');
    var deleteIcon = document.createElement('img');
    var anchor = document.createElement('a');

    paragraph.textContent = `${new Date(item.navigationDate).toLocaleString()} - ${item.title}`;
    paragraph.classList.add('truncate');

    deleteIcon.src = './icons/xmark.svg'
    deleteIcon.alt = 'Delete record'
    deleteIcon.addEventListener('click', () => deleteItem(item))

    anchor.href = item.url;
    anchor.target = '_blank';

    anchor.appendChild(paragraph)

    listItem.appendChild(anchor);
    listItem.appendChild(deleteIcon)

    sitesList.appendChild(listItem)
}

function emptyHistoryList () {
    //Display text
    const paragraph = document.createElement('p');
    paragraph.classList.add('no-records');

    paragraph.textContent = 'There are no records saved. Start browsing!'

    sitesList.appendChild(paragraph)

    //Disable arrow buttons
    const leftButton = document.getElementById('left-arrow');
    leftButton.setAttribute('disabled', true)

    const rightButton = document.getElementById('right-arrow');
    rightButton.setAttribute('disabled', true)
}

function deleteItem (item) {
    const searchText = input.value
    sitesList.innerHTML = ''
    loaderContainer.style.display = 'block';

    chrome.runtime.sendMessage({ type: "deleteHistoryEntry", item, offset: 0, limit: ITEMS_PER_PAGE, search: searchText }, function (response) {
        if (response.error) {
            handleLogoutUser()
            return
        }

        refreshNavigationHistoryList(response)
    })
}


document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ type: "getHistory", offset: 0, limit: ITEMS_PER_PAGE, search: '' }, function (response) {
        if (response.error) {
            handleLogoutUser()
            return
        }

        loaderContainer.style.display = 'none';
        if (response && response.items?.length) {
            paginationData = new Pagination(response.count, ITEMS_PER_PAGE)

            response.items.forEach(record => {
                appendHistoryItem(record);
            });


            //When popup is open, left arrow always is going to be disable
            const leftButton = document.getElementById('left-arrow');
            leftButton.setAttribute('disabled', true)

            if (response.count <= response.limit) {
                const rightButton = document.getElementById('right-arrow');
                rightButton.setAttribute('disabled', true)
            }
            const paginationInfo = document.getElementById('pagination-info');
            paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`
        } else {
            emptyHistoryList()
        }
    });
});

// Pagination
const leftButton = document.getElementById('left-arrow');

leftButton.addEventListener('click', function () {
    paginationData.prevPage()
    sitesList.innerHTML = ''
    loaderContainer.style.display = 'block';
    const searchText = input.value

    chrome.runtime.sendMessage({ type: "getHistory", offset: paginationData.getStartIndex(), limit: ITEMS_PER_PAGE, search: searchText }, function (response) {
        if (response.error) {
            handleLogoutUser()
            return
        }

        loaderContainer.style.display = 'none';
        if (response && response.items?.length) {
            response.items.forEach(record => {
                appendHistoryItem(record);
            });

            if (response.offset == 0) {
                const leftButton = document.getElementById('left-arrow');
                leftButton.setAttribute('disabled', true)
            }

            //When user move to the previous page, right arrow always is going to be enable
            const rightButton = document.getElementById('right-arrow');
            rightButton.removeAttribute('disabled')

            const paginationInfo = document.getElementById('pagination-info');
            paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`
        }
    });
})

const rightButton = document.getElementById('right-arrow');

rightButton.addEventListener('click', function () {
    paginationData.nextPage()
    sitesList.innerHTML = ''
    loaderContainer.style.display = 'block';
    const searchText = input.value

    chrome.runtime.sendMessage({ type: "getHistory", offset: paginationData.getStartIndex(), limit: ITEMS_PER_PAGE, search: searchText }, function (response) {
        if (response.error) {
            handleLogoutUser()
            return
        }

        loaderContainer.style.display = 'none';
        if (response && response.items?.length) {
            response.items.forEach(record => {
                appendHistoryItem(record);
            });

            //When user move to the next page, left arrow always is going to be enable
            const leftButton = document.getElementById('left-arrow');
            leftButton.removeAttribute('disabled')

            if ((response.limit + response.offset) >= response.count) {
                const rightButton = document.getElementById('right-arrow');
                rightButton.setAttribute('disabled', true)
            }

            const paginationInfo = document.getElementById('pagination-info');
            paginationInfo.innerHTML = `${paginationData.getCurrentPage()} / ${paginationData.getTotalPages()}`
        }
    });
})