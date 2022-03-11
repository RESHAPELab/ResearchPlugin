chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.status === "complete" && tab.url) {
    chrome.tabs.sendMessage(tabId, {
      type: "CHECK_URL",
    });
  }
  chrome.tabs.sendMessage(tabId, {
    type: "UPDATE_REPO_LAYOUT",
  });
});

chrome.runtime.onMessage.addListener(handleMessage);

/**
 * Function name: handleMessage
 * @param {string} msg
 * Responds to changes in content script
 */
function handleMessage(msg) {
  if (msg.type === "OPEN_COMPLETE_OVERVIEW") {
    chrome.tabs.create({ url: chrome.runtime.getURL("content/overview.html") });
  }
}
