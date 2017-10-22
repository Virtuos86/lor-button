var defaultValue = 60;

function saveOptions(event) {
    event.preventDefault();
  
    var val = document.getElementById("update-interval").value;
    if (val == "") {
        document.getElementById("update-interval").value = defaultValue;
        val = defaultValue;
    };
    chrome.storage.sync.set({
        "update-interval": val
    }, () => {
        let status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 1000);
    });
}

function onGot(item) {
    document.getElementById("update-interval").value = item["update-interval"];
}

function restoreOptions() {
    var item = chrome.storage.sync.get({ "update-interval": 60 }, onGot);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("form").addEventListener("submit", saveOptions);
