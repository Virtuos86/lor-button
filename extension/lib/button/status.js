function StatusButton(options) {
    var NORMAL = 1;
    var ERROR_LOGIN = 2;
    var ERROR_CONNECT = 3;

    var button = {
        id: options.id,
        label: options.label,
        icon: options.icon,
        onClick: options.onClick
    };

    function setState(status, count=0) {
        switch(status) {
            case NORMAL:
                if (count > 0) {
                    chrome.browserAction.setIcon({ path: button.icon.notice });
                    if (count == 1) {
                        chrome.browserAction.setTitle({
                            title: count.toString() + chrome.i18n.getMessage("unread_notification")
                        });
                    } else if (count < 5) {
                        chrome.browserAction.setTitle({
                            title: count.toString() + chrome.i18n.getMessage("unread_notifications24")
                        });
                    } else {
                        chrome.browserAction.setTitle({
                            title: count.toString() + chrome.i18n.getMessage("unread_notifications5N")
                        });
                    }
                } else {
                    chrome.browserAction.setIcon({ path: button.icon.normal });
                    chrome.browserAction.setTitle({
                        title: chrome.i18n.getMessage("no_unread_notifications")
                    });
                }
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

