window.old_alert = window.alert;
window.alert = function (message, type, title)
{
    if (!type)
    {
        type = 'info';
    }
    if (!title)
    {
        title = '';
    }
    showNotification(title, message, type);
};
function getDuration()
{
    return 4000;
}
function getTemplate(title)
{
    if (title || title !== "")
    {
        return '<div data-notify="container" class="secondarycolor notification notification-{0}">' +
            '<table class="notification-table"><tr><td rowspan="2" class="notification-icon">' +
            '<span data-notify="icon" class="{0}-icon"></span></td><td class="notification-title">' +
            '<span data-notify="title">{1}&nbsp;</span></td><td rowspan="2" class="notification-icon" data-notify="dismiss">' +
            '<span class="notification-icon"><i class="fa fa-times"></i></span></td></tr>' +
            '<tr><td><span class="notification-message" data-notify="message">{2}&nbsp;</span></td></tr>' +
            '</table></div>';
    }
    return '<div data-notify="container" class="secondarycolor notification notification-{0}">' +
        '<table class="notification-table"><tr><td class="notification-icon">' +
        '<span data-notify="icon" class="{0}-icon"></span></td><td class="notification-message">' +
        '<span data-notify="message">{2}&nbsp;</span></td><td class="notification-icon" data-notify="dismiss">' +
        '<span class="notification-icon"><i class="fa fa-times"></i></span></td></tr>' +
        '</table></div>';
}

function getSavingTemplate()
{
    return '<div data-notify="container" class="secondarycolor notification notification-{0}">' +
        '<table class="notification-table"><tr><td class="notification-icon">' +
        '<span data-notify="icon" class="{0}-icon"></span></td><td class="notification-message">' +
        '<span data-notify="message">{2}&nbsp;</span></td><td class="notification-icon" data-notify="dismiss">' +
        '<span class="notification-icon"><i class="fa fa-times"></i></span></td></tr>' +
        '<tr><td colspan="3" class="progress notification-progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0} notification-progress-bar" role= "progressbar" aria- valuenow="0" aria- valuemin="0" aria- valuemax="100" style="width: 0%;"></div>' +
        '</td></tr></table>';
}
function getOffset()
{
    return {
        x: 0,
        y: 52
    };
}
//further information about the attributes: http://bootstrap-notify.remabledesigns.com/
function showNotification(title, message, type)
{
    if (!type)
    {
        type = "info";
    }
    type = type.toLowerCase();
    var ico;
    var notifytype;
    switch (type)
    {
        case 'success':
            ico = "fa fa-check";
            notifytype = "success";
            break;
        case 'warning':
            ico = "fa fa-exclamation";
            notifytype = "warning";
            break;
        case 'danger':
            ico = "fa fa-ban";
            notifytype = "danger";
            break;
        case 'save':
            showSaveNotification(title, message);//the title is the duration (a number)
            return;
        default:
            ico = 'fa fa-info';
            notifytype = 'info';
            break;
    }
    $.notify({
        // options
        icon: ico,
        title: title,
        message: message,
    }, {
            // settings
            element: 'body',
            position: null,
            type: notifytype,
            allow_dismiss: true,
            newest_on_top: true,
            placement: {
                from: "top",
                align: "right"
            },
            offset: getOffset(),
            spacing: 10,
            z_index: 9999,
            delay: getDuration(),
            mouse_over: 'pause',
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            icon_type: 'class',
            template: getTemplate(title)
        });
}
function showSuccessNotification(title, message)
{
    showNotification(title, message, "success");
}
function showInfoNotification(title, message)
{
    showNotification(title, message, "info");
}
function showWarningNotification(title, message)
{
    showNotification(title, message, "warning");
}
function showDangerNotification(title, message)
{
    showNotification(title, message, "danger");
}
function showSaveNotification(duration, message)
{
    if (!duration || isNaN(duration))
    {
        duration = getDuration();
    }
    var msg = message.toString().split(";");
    if (msg.lenght < 5)
    {
        var defaultmsg = ['', '', '', '', ''];
        for (var i = 4; i > msg.length - 1; i--)
        {
            defaultmsg[i] = msg[msg.length - 1];
        }
        msg = defaultmsg;
    }
    var notify = $.notify({
        // options
        icon: 'fa fa-floppy-o',
        title: '',
        message: msg[0],
    }, {
            // settings
            element: 'body',
            position: null,
            type: "success",
            allow_dismiss: false,
            showProgressbar: true,
            newest_on_top: true,
            placement: {
                from: "top",
                align: "right"
            },
            offset: getOffset(),
            spacing: 10,
            z_index: 9999,
            delay: duration,
            mouse_over: null,
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            icon_type: 'class',
            template: getSavingTemplate()
        });
    setTimeout(function ()
    {
        notify.update('message', msg[1]);
    }, duration / 4);

    setTimeout(function ()
    {
        notify.update('message', msg[2]);
    }, duration / 2);

    setTimeout(function ()
    {
        notify.update('message', msg[3]);
    }, (duration / 4) * 3);

    setTimeout(function ()
    {
        notify.update('message', msg[4]);
        notify.update('icon', 'fa fa-check');
    }, duration);
}