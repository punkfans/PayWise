chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponse({hostName: window.location.hostname});
});