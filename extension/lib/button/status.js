function StatusButton(options) {
    var NORMAL = 1;
    var ERROR_LOGIN = 2;
    var ERROR_CONNECT = 3;

    var icon = options.icon;
    var site = options.site;

    var button = {
        id: options.id,
        label: options.label,
        icon: icon.normal,
        onClick: options.onClick
    };

    var setState = function(status, count=0) {
        switch(status) {
            case NORMAL:
                if (count > 0) {
                    button.label = chrome.i18n.getMessage("unread_notifications", count);
                    button.icon = icon.notice;
                }
                else {
                    button.label = chrome.i18n.getMessage("no_unread_notifications");
                    button.icon = icon.normal;
                }
                break;
            case ERROR_LOGIN:
                button.label = chrome.i18n.getMessage("you_have_to_be_logged_into", site);
                button.icon = icon.error;
                break;
            case ERROR_CONNECT:
                button.label = chrome.i18n.getMessage("server_not_found");
                button.icon = icon.error;
        }
    };

    return {
        NORMAL: NORMAL,
        ERROR_LOGIN: ERROR_LOGIN,
        ERROR_CONNECT: ERROR_CONNECT,

        setState: setState
    };
}

