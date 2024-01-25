document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('input');
    const button = document.getElementById('button');
    const saveHistoryButton = document.getElementById('saveHistory');
    const sitesList = document.getElementById('sites-list');

    // Function to create and append history item to list
    function appendHistoryItem(item) {
        var listItem = document.createElement('li');
        var anchor = document.createElement('a');
        anchor.href = item.url;
        anchor.target = '_blank';
        anchor.textContent = item.url;
        anchor.classList.add('truncate');
        listItem.appendChild(anchor);
        sitesList.insertBefore(listItem, sitesList.firstChild); // Insert at the top
    }

    chrome.runtime.sendMessage({ type: "getHistory" }, function(response) {
        response.history.forEach(url => {
            appendHistoryItem({ url: url });
        });
    });

});
