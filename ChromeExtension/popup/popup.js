$('#togBtn').click(() => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { type: 'TOGGLE_EXTENSION' });
  });
});
