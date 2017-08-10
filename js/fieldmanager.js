$(function ()
{
    $("#draggable-fieldtypes .list-group-item").draggable({
        cursor: 'move',
        helper: 'clone',
        zIndex: 100,
        connectToSortable: ".sortable-list",
        revert: "invalid",
        scroll: false
    });

    $(this).reloadInlineFunctions();
    $('.sortable-list').reloadSortable();
}); 