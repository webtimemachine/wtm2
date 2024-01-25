
// This code runs in the context of the webpage
let currentURL = window.location.href;

// Send a message to the global page with the current URL

safari.extension.dispatchMessage("SaveURL", { url: currentURL });
