"use strict";
function isSmallWindow()
{
    return ($(window).width() < 765);
}
function onTopActionBarNavbarExpandButton()
{
    if ($('#small').attr("media") === '(max-width: 100000px)')//is retracted
    {
        expand();
    }
    else if ($('#small').attr("media") === '(max-width: 0px)')//is expanded
    {
        retract();
    }
    else
    {
        if (isSmallWindow())
        {
            expand();
        }
        else
        {
            retract();
        }
    }
}
function retract()
{
    $('#small').attr("media", "(max-width: 100000px)");
    enableContent();
    storeValue("sideNavbarExpanded", 'false');//Uses localStorage.js
}
function expand()
{
    $('#small').attr("media", "(max-width: 0px)");
    storeValue("sideNavbarExpanded", 'true');//Uses localStorage.js
    if (isSmallWindow())
    {
        disableContent();
    }
}
$(window).resize(function ()
{
    if (isSmallWindow() && ($('#small').attr("media") === '(max-width: 0px)'))
    {
        disableContent();
    }
    if (($('#small').attr("media") === '(max-width: 0px)') && !isSmallWindow())
    {
        enableContent();
    }
    if ($(window).width() < 620)
    {
        searchbarToNormalWidth("276px");
        historybarToNormalWidth("276px");
    }
    else
    {
        searchbarToNormalWidth((window.navigator.userAgent.search(/(MSIE|Trident)/) > -1) ? "279px" : "283px");
        historybarToNormalWidth((window.navigator.userAgent.search(/(MSIE|Trident)/) > -1) ? "319px" : "323px");
    }
    deleteStoredValue('sideNavbarExpanded');
});
function disableContent()
{
    $('.contentoverlay').css('background', 'rgba(0, 0, 0, .5)');
    $('.content').css('background', 'rgba(0, 0, 0, .5)');
    $(".contentoverlay :input").attr("disabled", true);
    $('.contentoverlay').addClass("noselect");
}
function enableContent()
{
    $('.contentoverlay').css('background', 'transparent');
    $('.content').css('background', 'transparent');
    $(".contentoverlay :input").attr("disabled", false);
    $('.contentoverlay').removeClass("noselect");
}
function setNavbarState(state)//0 = Responsive | 1 = Expanded | 2 = Retracted
{
    if (state === 1)
    {
        expand();
    }
    if (state === 2)
    {
        retract();
    }
}
function changeLanguage(lang)//called when a languagechange is requested
{
    alert("Language was changed to " + lang);
}

$(document).ready(function ()
{
    loadPageGuideData();
    var primaryColor = [28, 67, 104];
    var secondaryColor = [77, 78, 90];
    var themeColor = [255, 255, 255];
    try
    {
        addDynamicColors(primaryColor, secondaryColor, themeColor);
    }
    catch (err)
    {
        console.log(err.message + " | color.js nicht eingebunden. Verbesserte Dummy-Version aktiv");
    }

    var sidebarState = getStoredValue('sideNavbarExpanded');
    if (sidebarState === 'true')
    {
        $('.sidebar').addClass('notransition');
        $('.content').addClass('notransition');
        $('.sidebaritem > span').addClass('notransition');
        $('.sidebar').offsetHeight;
        setTimeout(function ()
        {
            expand();
            $('.sidebaritem > span').offsetHeight;
            $('.content').offsetHeight;
            $('.sidebaritem > span').removeClass('notransition');
            $('.sidebar').removeClass('notransition');
            $('.content').removeClass('notransition');
        }, 200);
    }
    if (sidebarState === 'false')
    {
        $('.sidebar').addClass('notransition');
        $('.content').addClass('notransition');
        $('.tab-navigation').addClass('notransition');
        $('.sidebaritem > span').addClass('notransition');
        $('.sidebar').offsetHeight;

        retract();
        $('.sidebaritem > span').offsetHeight;
        $('.content').offsetHeight;
        setTimeout(function ()
        {
            $('.sidebaritem > span').removeClass('notransition');
            $('.sidebar').removeClass('notransition');
            $('.content').removeClass('notransition');
            $('.tab-navigation').removeClass('notransition');
        }, 200);
    }
    setInterval(function ()
    {
        $(".historyresult > input").each(function ()
        {
            var date = $(this).val();
            var newtime = calculateHistoryTime(date);
            var oldtime = $(this).parent().find('.historyresult-timerow > span').html();
            if (newtime !== oldtime)
            {
                $(this).parent().find('.historyresult-timerow > span').fadeOut(500, function ()
                {
                    $(this).html(calculateHistoryTime(date)).fadeIn(500);
                });
            }
        });
    }, 1000 * 60);
});
$('.dropdown-button').click(function (evt)
{
    if (!evt)
    {
        evt = window.event;
    }
    if (isSmallWindow())
    {
        retract();
    }
    if (!($(evt.target).hasClass('dropdown-content') || $(evt.target).parents('.dropdown-content').length > 0))
    {
        var state = $(this).find('.dropdown-content').attr('aria-hidden');
        if (state === 'true')
        {
            showClickedHidedDropdown(this)
        } else
        {
            hideClickedVisibleDropdown(this);
        }
    }
});
function showClickedHidedDropdown(dropdown)
{
    $('body').not(dropdown).find('.dropdown-content').hide();
    $('body').not(dropdown).find('.dropdown-content').attr('aria-hidden', 'true');
    if ($('body').find('.dropdown-content').parent().hasClass('secondarycolor'))
    {
        $('body').find('.dropdown-content').parent().addClass('hoversecondary');
        $('body').find('.dropdown-content').parent().removeClass('secondarycolor');
    }
    $(dropdown).find('.dropdown-content').attr('aria-hidden', 'false');
    if ($(dropdown).find('.dropdown-content').hasClass("searchsidebar") || $(dropdown).find('.dropdown-content').hasClass("historysidebar"))
    {
        onSidebarExpand(dropdown);
    }
    else
    {
        $(dropdown).find('.dropdown-content').toggle(300);
    }
    if ($(dropdown).hasClass('hoversecondary'))
    {
        $(dropdown).addClass('secondarycolor');
        $(dropdown).removeClass('hoversecondary');
    }
}
function hideClickedVisibleDropdown(dropdown)
{
    if ($(dropdown).find('.dropdown-content').hasClass("searchsidebar") || $(dropdown).find('.dropdown-content').hasClass("historysidebar"))
    {
        onSidebarRetract(dropdown);
    }
    else
    {
        $(dropdown).find('.dropdown-content').toggle(300);
    }
    if ($(dropdown).hasClass('secondarycolor'))
    {
        $(dropdown).addClass('hoversecondary');
        $(dropdown).removeClass('secondarycolor');
    }
    $(dropdown).find('.dropdown-content').attr('aria-hidden', 'true');
}
$('body').click(function (evt)
{
    if (!evt)
    {
        evt = window.event;
    }
    var isOutsideOfDropdown = ($(evt.target).parents('.dropdown-content').length === 0 && $(evt.target).children('.dropdown-content').length === 0 &&
        !$(evt.target).hasClass('dropdown-content') && $(evt.target).parent().children('.dropdown-content').length === 0);
    var isClickable = (($(evt.target).attr("onClick") !== undefined) || ($(evt.target).prop("tagName") === "A") || ($(evt.target).prop("tagName") === "BUTTON")) && !$(evt.target).hasClass("dontclose");
    if (isOutsideOfDropdown || isClickable)
    {
        $('body').find('.dropdown-content').hide();
        $('body').find('.dropdown-content').attr('aria-hidden', 'true');
        if ($('body').find('.dropdown-content').parent().hasClass('secondarycolor'))
        {
            $('body').find('.dropdown-content').parent().addClass('hoversecondary');
            $('body').find('.dropdown-content').parent().removeClass('secondarycolor');
        }
    }
});
//Searchbar & Historybar
function searchbarToNormalWidth(width)
{
    $('.searchsidebar-displayall > i').removeClass("rotate");
    $('.searchsidebar-displayall > span').show();
    $('.searchsidebar').animate({
        opacity: 1,
        width: width
    }, { duration: 250, queue: false });
}
function historybarToNormalWidth(width)
{
    $('.historysidebar-displayall > i').removeClass("rotate");
    $('.historysidebar-displayall > span').show();
    $('.historysidebar').animate({
        opacity: 1,
        width: width
    }, { duration: 250, queue: false });
}
$('.searchsidebar-displayall').click(function ()
{
    if (!$(window).width() < 620)
    {
        var barwidth = $('.searchsidebar').css("width").toString();
        var ieWidthFix = (window.navigator.userAgent.search(/(MSIE|Trident)/) > -1) ? "279px" : "283px";
        if (parseInt(barwidth.substring(0, barwidth.length - 2)) !== 283 && parseInt(barwidth.substring(0, barwidth.length - 2)) !== 279 && parseInt(barwidth.substring(0, barwidth.length - 2)) !== 276)
        {
            searchbarToNormalWidth(ieWidthFix);
        }
        else
        {
            $('.searchsidebar-displayall > i').addClass("rotate");
            $('.searchsidebar-displayall > span').hide();
            $('.searchsidebar').animate({
                opacity: 1,
                width: "75%"
            }, { duration: 350, queue: false });
        }
    }
    $("#searchbarinput").focus();
});
$('.historysidebar-displayall').click(function ()
{
    if (!$(window).width() < 620)
    {
        var barwidth = $('.historysidebar').css("width").toString();
        //check for ie
        var ieWidthFix = (window.navigator.userAgent.search(/(MSIE|Trident)/) > -1) ? "319px" : "323px";
        if (parseInt(barwidth.substring(0, barwidth.length - 2)) !== 323 && parseInt(barwidth.substring(0, barwidth.length - 2)) !== 319 && parseInt(barwidth.substring(0, barwidth.length - 2)) !== 276)
        {
            historybarToNormalWidth(ieWidthFix);
        }
        else
        {
            $('.historysidebar-displayall > i').addClass("rotate");
            $('.historysidebar-displayall > span').hide();
            $('.historysidebar').animate({
                opacity: 1,
                width: "75%"
            }, { duration: 350, queue: false });
        }
    }
});
function animateWidth(elem)
{
    $(elem).animate({
        opacity: "toggle",
        width: "toggle"
    }, 300);
}
function onSidebarExpand(dropdown)
{
    animateWidth($(dropdown).find('.dropdown-content'));
    if ($(dropdown).find('.dropdown-content').hasClass("searchsidebar"))
    {
        $("#searchbarinput").focus();
    }
}
function onSidebarRetract(dropdown)
{
    animateWidth($(dropdown).find('.dropdown-content'));
}
function searchInputIsNotEmpty()
{
    return $('#searchbarinput').val() && ($('#searchbarinput').val() !== "");
}
function parseSearchData(data)
{
    var resultcount = 0;
    $('.searchresults').empty();
    $.each(data, function (idx, obj)
    {
        var title = obj.titleText;
        var subtitle = obj.subTitleText;
        var icon = obj.icon;
        if (icon.substring(0, 2) === "fa")
        {
            $('.searchresults').append('<div class="searchresult secondarycolorhover">' +
                '<table>' +
                '<tr>' +
                '<td rowspan="2" class="searchresult-shortrow"><i class="fa ' + icon + '" aria-hidden="true"></i></td>' +
                '<td><span>' + title + '</span></td>' +
                '</tr>' +
                '<tr> ' +
                '<td class="smaller"> <span>' + subtitle + '</span></td> ' +
                '</tr> ' +
                '</table> ' +
                '</div>');
        }
        else
        {
            $('.searchresults').append('<div class="searchresult secondarycolorhover">' +
                '<table>' +
                '<tr>' +
                '<td rowspan="2" class="searchresult-shortrow"><img src="' + icon + '"/></td>' +
                '<td><span>' + title + '</span></td>' +
                '</tr>' +
                '<tr> ' +
                '<td class="smaller"> <span>' + subtitle + '</span></td> ' +
                '</tr> ' +
                '</table> ' +
                '</div>');
        }
        resultcount++;
    });
    var countname = "Ergebnis";
    var noresults = "keine Treffer";
    if (resultcount > 1)
    {
        countname += "se";
    }
    if (resultcount === 0)
    {
        $('.searchresults').append('<div class="searchresult">' +
            '<table>' +
            '<tr>' +
            '<td class="searchresult-shortrow"></td>' +
            '<td><span>' + noresults + '</span></td>' +
            '</tr>' +
            '</table> ' +
            '</div>');
    }
    $(".searchbar-resultcount > span").html(resultcount + " " + countname);
}
function parseHistoryData(data)
{
    var resultcount = 0;
    $('.historyresults').empty();
    $.each(JSON.parse(data), function (idx, obj)
    {
        var title = obj.titleText;
        var subtitle = obj.actionText;
        var icon = obj.icon;
        var doneAt = obj.actionDoneAt;

        if (icon.substring(0, 2) === "fa")
        {
            $('.historyresults').append('<div class="historyresult secondarycolorhover">' +
                '<input type="hidden" value="' + doneAt + '"/>' +
                '<table>' +
                '<tr>' +
                '<td rowspan="2" class="historyresult-shortrow"><i class="fa ' + icon + '" aria-hidden="true"></i></td>' +
                '<td><span>' + title + '</span></td>' +
                '<td rowspan="2" class="historyresult-timerow"><span>' + calculateHistoryTime(doneAt) + '</span></td>' +
                '</tr>' +
                '<tr> ' +
                '<td class="smaller"><span>' + subtitle + '</span></td> ' +
                '</tr> ' +
                '</table> ' +
                '</div>');
        }
        else
        {
            $('.historyresults').append('<div class="historyresult secondarycolorhover">' +
                '<input type="hidden" value="' + doneAt + '"/>' +
                '<table>' +
                '<tr>' +
                '<td rowspan="2" class="historyresult-shortrow"><img src="' + icon + '"/></td>' +
                '<td><span>' + title + '</span></td>' +
                '<td rowspan="2" class="historyresult-timerow"><span>' + calculateHistoryTime(doneAt) + '</span></td>' +
                '</tr>' +
                '<tr> ' +
                '<td class="smaller"> <span>' + subtitle + '</span></td> ' +
                '</tr> ' +
                '</table> ' +
                '</div>');
        }
        resultcount++;
    });
    var noresults = "keine Treffer";
    if (resultcount === 0)
    {
        $('.historyresults').append('<div class="historyresult">' +
            '<table>' +
            '<tr>' +
            '<td class="historyresult-shortrow"></td>' +
            '<td><span>' + noresults + '</span></td>' +
            '</tr>' +
            '</table> ' +
            '</div>');
    }
}
function calculateHistoryTime(time)
{
    var date = new Date(Date.parse(time));
    var currDate = new Date();
    var timeDiff = Math.abs(currDate.getTime() - date.getTime());
    if (timeDiff > 1000 * 3600 * 24)
    {
        var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (dayDiff > 1)
        {
            return "vor " + dayDiff + " Tagen";
        }
        return "vor einem Tag";
    }
    if (timeDiff > 1000 * 3600)
    {
        var hDiff = Math.ceil(timeDiff / (1000 * 3600));
        if (hDiff > 1)
        {
            return "vor " + hDiff + " Stunden";
        }
        return "vor einer Stunde";
    }
    if (timeDiff > 1000 * 60)
    {
        var minDiff = Math.ceil(timeDiff / (1000 * 60));
        if (minDiff > 1)
        {
            return "vor " + minDiff + " Minuten";
        }
        return "vor einer Minute";
    }
    return "gerade eben";
}
function loadPageGuideData()
{
    var guide;
    if (typeof defaultSteps !== 'undefined')
    {
        guide = {
            id: 'applicationHelp',
            title: 'title',
            steps: defaultSteps
        }
    }
    else
    {
        guide = {
            id: 'applicationHelp',
            title: 'title',
            steps: []
        }
    }
    var iteratingHelpId = 0;
    //data-help-position="" data-help-text=""
    $("[data-help-text]").each(function ()
    {
        var helpText = $(this).attr('data-help-text');
        var helpPosition = $(this).attr('data-help-position');
        var helpId = $(this).attr('id');
        iteratingHelpId++;
        if (helpText && helpPosition)
        {
            if (!helpId)
            {
                $(this).attr('id', 'fieldWithHelp_' + iteratingHelpId);
                helpId = $(this).attr('id');
            }
            var stepsArray = guide['steps'];
            stepsArray.push({
                target: '#' + helpId,
                content: helpText,
                direction: helpPosition
            });
            guide['steps'] = stepsArray;
        }
    });
    $.pageguide();
    $.pageguide('load', guide);
}