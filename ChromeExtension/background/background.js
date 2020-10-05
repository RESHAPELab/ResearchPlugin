chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.tabs.sendMessage(tabId, {
    type: 'CHECK_URL',
  });
  chrome.tabs.sendMessage(tabId, {
    type: 'UPDATE_REPO_LAYOUT',
  });
});

/**
 * Function name: handleMessage
 * @param {string} msg
 * @param {string} sender
 * @param {string} sendResponse
 * Responds to changes in content script
 */
function handleMessage(msg) {
  if (msg.type === 'OPEN_COMPLETE_OVERVIEW') {
    chrome.tabs.create({ url: chrome.runtime.getURL('content/overview.html') });
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
