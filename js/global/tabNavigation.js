$(document).ready(function ()
{
    $('.tab-icon,.tab-text').click(function ()
    {
        changeTabTo(this);
    });
    $('.tab-close').click(function ()
    {
        closeTab(this);
    });
    $('.contentpanel-minimize').click(function ()
    {
        var elemId = $(this).parents('.contentpanel').attr('id');
        if (elemId)
        {
            var id = parseInt(elemId.substr(-1), 10);
            minimizeTab('#tab-' + id);
        }
    });
    $('.contentpanel-close').click(function ()
    {
        var elemId = $(this).parents('.contentpanel').attr('id');
        if (elemId)
        {
            var id = parseInt(elemId.substr(-1), 10);
            closeTab('#tab-' + id);
        }
    });
});
function minimizeTab(tab)
{
    //get tab id
    var id = parseInt($(tab).attr('id').substr(-1), 10);
    //open the new one if the old was active
    if ($("#tab-" + id).hasClass("activetab"))
    {
        changeTabIfOldWasActive(id);
    }
}
function changeTabIfOldWasActive(id)
{
    var changeid = -1;
    //look for the new one on the right side
    for (var i = id + 1; i < 7; i++)
    {
        if ($("#tabClose-" + i).length > 0)
        {
            changeid = i;
            break;
        }
    }
    if (changeid === -1)
    {
        //if no tab is on the right side, look on the left side
        for (var j = id - 1; j > 0; j--)
        {
            if ($("#tabClose-" + j).length > 0)
            {
                changeid = j;
                break;
            }
        }
    }
    //if a other tab than the closed one is found, change to it
    if (changeid > 0)
    {
        changeTabTo("#tabClose-" + changeid);
    }
}
function closeTab(tab)
{
    minimizeTab(tab);
    var id = parseInt($(tab).attr('id').substr(-1), 10);
    //close the old tab
    $('#tab-' + id).remove();
    //delete the content of the old tab
    $('#contentpanel-' + id).empty();
}
function changeTabTo(current)
{
    //define the animation (all animations: https://daneden.github.io/animate.css/)
    var inAnimation = "slideInUp";
    var outAnimation = "slideOutDown";
    //get the id
    var id = $(current).attr('id').substr(-1);
    var tabdiv = $('#contentpanel-' + id);
    //only change tab if its not already visible
    if (tabdiv.hasClass('contentpanel-invisible'))
    {
        var activecontentpanel;
        //search for the visible tab
        $('.contentpanel').each(function ()
        {
            if (!$(this).hasClass('contentpanel-invisible'))
            {
                activecontentpanel = this;
            }
        });
        //prevent the scrollbar from appearing
        $('.content').css('overflow', 'hidden');
        //hide the old active panel
        $(activecontentpanel).addClass('animated ' + outAnimation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function ()
        {
            $(activecontentpanel).removeClass('animated ' + outAnimation);
            $(activecontentpanel).addClass('contentpanel-invisible');

            //show the new panel when the hide animation is finished
            tabdiv.removeClass('contentpanel-invisible');
            tabdiv.addClass('animated ' + inAnimation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function ()
            {
                tabdiv.removeClass('animated ' + inAnimation);
                tabdiv.removeClass('contentpanel-invisible');
                //reenable the scrollbar
                $('.content').css('overflow', 'auto');
            });
        });
        //change the active tab
        $(current).parents('.tab').first().addClass('activetab');
        $(current).parents('.tab-table').first().removeClass('secondarycolor');
        $(current).parents('.tab-table').first().addClass('primarycolor');
        var old_id = $(activecontentpanel).attr('id').substr(-1);
        $('#tabTable-' + old_id).removeClass('primarycolor');
        $('#tab-' + old_id).removeClass('activetab');
        $('#tabTable-' + old_id).addClass('secondarycolor');
    }
}