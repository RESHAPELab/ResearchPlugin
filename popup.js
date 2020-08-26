/**
 * Function name: progressBarPopUp
 * Toggles display for a progress bar on page, if any
 */
function progressBarPopUp() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: 'progress_bar' });
  });
}

/**
 * Function name: iconPopUp
 * Toggles display for icons on page, if any
 */
function iconPopUp() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: 'icon' });

    if (document.getElementById('iconBtn').checked) {
      chrome.storage.local.set({ iconStatus: true });
    } else {
      chrome.storage.local.set({ iconStatus: false });
    }
  });
}

/**
 * Function name: ribbonPopUp
 * Toggles display for ribbon on page, if any
 */
function ribbonPopUp() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: 'ribbon' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('iconStatus', (status) => {
    const switchStatus = status.iconStatus;

    if (switchStatus) {
      document.getElementById('iconBtn').checked = true;
    } else {
      document.getElementById('iconBtn').checked = false;
    }

    if (
      document.getElementsByClassName('helpIcon')[0].style.display == 'inline-block' &&
      switchStatus
    ) {
      document.getElementById('iconBtn').checked = true;
    }
  });

  document.getElementById('iconBtn').addEventListener('change', iconPopUp);

  document.getElementById('ribbonBtn').addEventListener('change', ribbonPopUp);

  document.getElementById('progressBarBtn').addEventListener('change', progressBarPopUp);
});
