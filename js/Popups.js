function showNonLockingPopup(controller, method) {
    // create a temporary Popup containing the loading spinner, which will be replaced by the popup that comes from the controller
    createTempSpinnerPopup('non-locking');

    showPopup(controller, method, '#applicationoverlay', 'non-locking');
}

function showLockingPopup(controller, method) {
    // create a temporary Popup containing the loading spinner, which will be replaced by the popup that comes from the controller
    createTempSpinnerPopup('locking');

    showPopup(controller, method, '#modal-container', 'locking')
}

function createTempSpinnerPopup(mode)
{
    var tempPopup = '<div class="modal-dialog modal-spinner" id="tempPopup">' +
            '<div class="modal-content modal-square-border tempDivContent">' +
                '<div class="modal-body tempDivBody">' +
                    '<div id="{0}" style="height: 100%">' +
                        '<div class="loader spinnerColorIeOnly" >' +
                            '<svg class="circular">' +
                                '<circle class="path" cx="50%" cy="50%" r="30" fill="none" stroke-width="6" stroke-miterlimit="10" />' +
                            '</svg>' +
                        '</div >' +
                    '</div >' +
                '</div>' +
            '</div>' +
        '</div>';

    var tempPopupDiv = document.createElement('div');
    tempPopupDiv.id = "tempPopupDiv";
    tempPopupDiv.innerHTML = tempPopup;

    if (mode == 'locking')
    {
        $('#modal-container').append(tempPopupDiv);
    } else if(mode == 'non-locking')
    {
        $('#applicationoverlay').append(tempPopupDiv);
    }
    
}

function showPopup(controller, method, container, popupType)
{
    // get the popup from the controller for the specific method
    $.get('/' + controller + '/' + method, function (data) {

        var sleepTimeout = 0;
        if (popupType == 'locking')
        {
            sleepTimeout = 150;
        }

        setTimeout(function() {
            var popupDiv = createPopupStructure(data);

            $(container).append(popupDiv);

            var popupId = $(popupDiv).find('#hiddenfield-popup-id').val();
        
            var modalContentId = '#modal-content-' + popupId;
            var modalPopupId = '#modal-popup-' + popupId;

            var barwidthNewPopup = $(modalContentId).css('width').toString();
            var barheightNewPopup = $(modalContentId).css('height').toString();

            var newWidth = $(modalContentId).width();

            var moveToLeft = (((newWidth - $('.tempDivContent').width()) / 2)) * (-1);
            var moveToLeftText = moveToLeft.toString();

            // animates the size of the spinner-popup to the size of the replacing popup and removes the spinner-popup
            $('.tempDivContent').animate({
                'height': barheightNewPopup,
                'width': barwidthNewPopup,
                'left': moveToLeftText
            }, 500, function () {
                $(modalPopupId).removeClass('popup-hidden');
                $('#tempPopupDiv').remove();
            });

            // makes the popup draggable, but only inside the window
            $(modalPopupId).draggable({
                start: function () {
                    $(this).attr("style", "transform: none !important; left: " + $(this).offset().left + "px ");
                }, handle: ".modal-header", containment: "window", scroll: false
            });
        }, sleepTimeout);
    });
}

function createPopupStructure(content) {
    // creating a unique id with which the popup will be identified
    var uuid = guid();

    // creating the structure of the popup, in which the content will be loaded
    var popupStructure =
        "<div class='modal-dialog popup-hidden dynamic-modal' id='modal-popup-" + uuid + "'>" +
        "<div class='modal-content modal-square-border' id='modal-content-" + uuid + "'>" +
        "<input type='hidden' id='hiddenfield-popup-id' value='" + uuid + "' />" +
        "<div class='modal-header' >" +
        "<button type='button' class='close' data-dismiss='modal' aria-label='Close' onclick='removePopup(\"" + uuid + "\")'>" +
        "<span aria-hidden='true'>&times;</span>" +
        "</button>" +
        "<h4 class='modal-title'>Basic Modal</h4>" +
        "</div>" +
        "<div class='modal-body' id='modal-body-" + uuid + "'>" +
        content +
        "</div>" +
        "</div>" +
        "</div>";

    if (popupStructure.indexOf('#PLACEHOLDER_GUID#') > -1) {
        popupStructure = popupStructure.replace('#PLACEHOLDER_GUID#', uuid);
    }

    return popupStructure;
}

function removePopup(popupId)
{
    var modalPopupId = '#modal-popup-' + popupId;
    $(modalPopupId).addClass('popup-hidden');
    // a timer is needed so that bootstrap can take its time to call the closing method and the modal won't be removed too fast
    setTimeout(function () {
        $(modalPopupId).remove();
    }, 2000);
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}