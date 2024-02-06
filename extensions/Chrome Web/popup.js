const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({ type: "logout" }, function (response) {
        window.location.replace('./popup-sign-in.html');
    });
})

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('input');
    const button = document.getElementById('button');
    const saveHistoryButton = document.getElementById('saveHistory');
    const sitesList = document.getElementById('sites-list');
    const loaderContainer = document.getElementById('loader-container');
    // Function to create and append history item to list
    function appendHistoryItem (item) {
        var listItem = document.createElement('li');
        var anchor = document.createElement('a');

        anchor.href = item.url;
        anchor.target = '_blank';

        anchor.textContent = `${new Date(item.navigationDate).toLocaleString()} - ${item.title}`;
        anchor.classList.add('truncate');

        listItem.appendChild(anchor);
        sitesList.insertBefore(listItem, sitesList.firstChild); // Insert at the top
    }

    chrome.runtime.sendMessage({ type: "getHistory" }, function (response) {
        loaderContainer.style.display = 'none';
        response && response.history?.length && response.history.forEach(record => {
            appendHistoryItem(record);
        });
    });

});
