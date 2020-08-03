chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === 'ACTIVITY_HISTORY_READY') {
    chrome.tabs.create({ url: chrome.runtime.getURL('overview.html') });
    sendResponse({
      type: 'NO_DATA',
    });
  }
});
