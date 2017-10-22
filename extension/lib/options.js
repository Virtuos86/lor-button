var defaultValue = 60;

function saveOptions(event) {
    event.preventDefault();
  
    var val = document.getElementById("autorefreshIntervalSecs").value;
    if (val == "") {
        document.getElementById("autorefreshIntervalSecs").value = defaultValue;
        val = defaultValue;
    };
    chrome.storage.sync.set({
        autorefreshIntervalSecs: val
    }, () => {
        let status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 1000);
    });
}

function onGot(item) {
    document.getElementById("autorefreshIntervalSecs").value = item.autorefreshIntervalSecs;
}

function restoreOptions() {
    var item = chrome.storage.sync.get("autorefreshIntervalSecs", onGot);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("form").addEventListener("submit", saveOptions);
