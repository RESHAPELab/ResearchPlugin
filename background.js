chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === 'OPEN_COMPLETE_OVERVIEW') {
    chrome.tabs.create({ url: chrome.runtime.getURL('overview.html') });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.sendMessage(tabId, {
    type: 'CHECK_URL',
  });
  chrome.tabs.sendMessage(tabId, {
    type: 'UPDATE_REPO_LAYOUT',
  });
});
