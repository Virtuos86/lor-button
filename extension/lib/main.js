/* ::::: ::::: */

const checkUrl = "https://www.linux.org.ru/notifications-count";
const notifUrlPattern = "*://www.linux.org.ru/notifications";
const notifUrl = "https://www.linux.org.ru/notifications";
var XHR = new XMLHttpRequest();

function Request(options) {
    XHR.abort();
    XHR.open("GET", options.url, true);
    var timeout = setTimeout(() => { XHR.abort(); }, 10000);
    XHR.onreadystatechange = () => {
        clearTimeout(timeout);
        options.onComplete(XHR);
    };
    XHR.send(null);
};

/* ::::: Status Button ::::: */

var button = StatusButton({
    id: "lor-notifier",
    site: "linux.org.ru",
    label: chrome.i18n.getMessage("lor_notifier"),
    icon: {
        normal: {
            "18": "extension/data/icon.png",
            "32": "extension/data/icon-menuPanel.png",
            "36": "extension/data/icon@2x.png",
            "64": "extension/data/icon-menuPanel@2x.png"
        },
        notice: {
            "18": "extension/data/iconNotification.png",
            "32": "extension/data/iconNotification-menuPanel.png",
            "36": "extension/data/iconNotification@2x.png",
            "64": "extension/data/iconNotification-menuPanel@2x.png"
        },
        error: {
            "18": "extension/data/iconWarning.png",
            "32": "extension/data/iconWarning-menuPanel.png",
            "36": "extension/data/iconWarning@2x.png",
            "64": "extension/data/iconWarning-menuPanel@2x.png"
        }
    },
    onClick: function(currentTab) {
        function onGetTabs(tabs) {
            /// If exists a tab with URL == `notify_Url` then we switches to this tab.
            var tab;
            var tabExists = false;
            for (var i in tabs) {
                tab = tabs[i];
                chrome.tabs.update(tab.id, { url: notifUrl, active: true });
                tabExists = true;
                break;
            }
            function onGetAllTabs(tabs) {
                /// If opened a new tab (or the start page) then we goes to the `notify_Url`.
                if (!tabExists) {
                    var urls = [
                        "about:blank",
                        "about:newtab",
                        "about:home",
                        "chrome://startpage/",
                        "chrome://newtab/"
                    ];
                    var tab = tabs.filter((tab) => {
                        if (tab.active)
                            return tab;
                        else
                            return null;
                    })[0];
                    if (urls.indexOf(tab.url) > -1) {
                        chrome.tabs.update(tab.id, { url: notifUrl });
                    }
                    else {
                        chrome.tabs.create({ url: notifUrl });
                    }
                }
            }
            chrome.tabs.query({}, onGetAllTabs);
            setTimeout(update, 5 * 1000);
        }
        chrome.tabs.query({ url: notifUrlPattern }, onGetTabs);
    }
});

/* ::::: Check updates ::::: */

function update() {
    Request({
        url: checkUrl,
        onComplete: function (xhr) {
            switch (xhr.status) {
                case 200:
                    var count = parseInt(xhr.responseText);
                    if (count.toString() == "NaN")
                        break;
                    button.setState(button.NORMAL, count);
                    break;
                case 403:
                    button.setState(button.ERROR_LOGIN);
                    break;
                default:
                    button.setState(button.ERROR_CONNECT);
            }
        }
    });
};

/* ::::: Set timer ::::: */

var timerId = null;
var updateInterval;

function onOk(item) {
    updateInterval = item["update-interval"];
    if (updateInterval < 5)
        updateInterval = 5;

    timerId = setInterval(update, updateInterval * 1000);
}

function updateTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
    } else {
        update();
    }
    chrome.storage.sync.get({ "update-interval": 60 }, onOk);
}

//chrome.browserAction.setBadgeBackgroundColor({
//    "color": "#FF0000"
//}); // #RGBA
//chrome.browserAction.setBadgeText({
//    "text": "LOR"
//}); // This text (only 4 chars allowed) will be shown on the background specified with `chrome.browserAction.setBadgeBackgroundColor`

chrome.browserAction.setBadgeBackgroundColor({ color: "#0099dd" });
chrome.browserAction.onClicked.addListener(button.button.onClick);
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        /*console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);*/
        if (storageChange.newValue) {
            updateTimer();
        }
    }
});
updateTimer();
