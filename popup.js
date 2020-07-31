  function progressBarPopUp() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "progress_bar"});
    
   });
}

function iconPopUp() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "icon"});

    if(document.getElementById("iconBtn").checked ) {
        chrome.storage.local.set({'iconStatus': true});
    }
    else {
        chrome.storage.local.set({'iconStatus': false});
    }
   });
}

function ribbonPopUp() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "ribbon"});
    
   });
}

document.addEventListener("DOMContentLoaded", function() {
    
    chrome.storage.local.get('iconStatus', function(status){
        var switchStatus = status.iconStatus;

        if(switchStatus) {
            document.getElementById('iconBtn').checked = true;
        } else {
            document.getElementById('iconBtn').checked = false;
        }

        console.log( document.getElementsByClassName('helpIcon')[0].style.display );
        if( document.getElementsByClassName('helpIcon')[0].style.display == 'inline-block' && switchStatus ) {
            document.getElementById('iconBtn').checked = true;
        }
    });

    
    document.getElementById('iconBtn').addEventListener("change", iconPopUp);

    document.getElementById('ribbonBtn').addEventListener("change", ribbonPopUp);

    document.getElementById('progressBarBtn').addEventListener("change", progressBarPopUp);

});

