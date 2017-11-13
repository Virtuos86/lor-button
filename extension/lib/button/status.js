function StatusButton(options) {
    var NORMAL = 1;
    var ERROR_LOGIN = 2;
    var ERROR_CONNECT = 3;

    var button = new Object(options);

    function setState(status, count=0) {
        switch(status) {
            case NORMAL:
                var path;
                var msg;
                if (count > 0) {
                    path = button.icon.notice;
                    if (count == 1) {
                        msg = "unread_notification";
                    } else if (count < 5) {
                        msg = "unread_notifications24";
                    } else {
                        msg = "unread_notifications5N";
                    }
                    chrome.browserAction.setBadgeText({ text: count.toString() });
                    chrome.browserAction.setTitle({
                        title: count.toString() + chrome.i18n.getMessage(msg)
                    });
                } else {
                    path = button.icon.normal;
                    msg = "no_unread_notifications";
                    chrome.browserAction.setBadgeText({ text: "" });
                    chrome.browserAction.setTitle({
                        title: chrome.i18n.getMessage(msg)
                    });
                }
                chrome.browserAction.setIcon({ path: path });
                break;
            case ERROR_LOGIN:
                chrome.browserAction.setIcon({ path: button.icon.error });
                chrome.browserAction.setTitle({
                    title: chrome.i18n.getMessage("you_need_to_be_logged_into", options.site)
                });
                break;
            case ERROR_CONNECT:
                chrome.browserAction.setIcon({ path: button.icon.error });
                chrome.browserAction.setTitle({
                    title: chrome.i18n.getMessage("server_not_found")
                });
        }
    };

    return {
        button: button,
        NORMAL: NORMAL,
        ERROR_LOGIN: ERROR_LOGIN,
        ERROR_CONNECT: ERROR_CONNECT,
        setState: setState
    };
}
