//jQuery.ajaxSetup({ async: false });

var baseLoc = window.location;
var id = 0;
var save = false;
var controls_types = ['Block', 'Container', 'Textbox', 'TextArea', 'HtmlEditor', 'Checkbox', 'Datepicker', 'Dropdown', 'Radiobutton', 'Lookup', 'Grid', 'Label'];
var selectedControl = null;
var selectingControl = false;
var savingControl = false;

var ControlSettingTypes = {
    ALIAS: 0,
    MAPPING: 1,
    SHOWLABEL: 2,
    SHOWHELP: 3
}

function loadContent() {
    var blocks = $.parseJSON(blockJsonObj);
    var containers = $.parseJSON(containerJsonObj);
    var controls = $.parseJSON(controlJsonObj);
    // id: 2078, positionX: 0, positionY: 0, width: 956, height: 160, type: 0, parentControlId: 0, fieldMappingId: 0, alias: null
    $.each(blocks, function (index, obj) {
        var element = document.createElement("div");
        element.setAttribute('data-response-id', obj.id);
        addElement('block', 'Block', 'frame', element, obj.id, obj);
    });

    $.each(containers, function (index, obj) {
        var element = document.createElement("div");
        element.setAttribute('data-response-id', obj.id);

        $("#" + obj.parentControlId + " .block_area").append(element);

        addElement('container', 'Container', '', element, obj.id, obj);
    });

    $.each(controls, function (index, obj) {
        var typeId = controls_types[obj.typeId];
        var element = document.createElement("div");
        element.setAttribute('data-response-id', obj.id);
        $("#" + obj.parentControlId + " .blocks").append(element);
        addElement('control', typeId, '', element, obj.id, obj);
    });
    save = true;
    event.preventDefault();
}


function saveObject($id) {
    var $object_to_save = $("#" + $id);
    var $parent = $object_to_save.parent().closest(".block_wrap");

    var x = $object_to_save.offset().left - $parent.offset().left;
    var y = $object_to_save.offset().top - $parent.offset().top;

    var controlObject = {};
    controlObject.PositionX = x;
    controlObject.PositionY = y;
    controlObject.Width = $object_to_save.width();
    controlObject.Height = $object_to_save.height();
    controlObject.FieldMappingId = $object_to_save.data('field-mapping-id') ? $object_to_save.data('field-mapping-id'):0;
    controlObject.ParentControlId = $parent.attr('data-response-id');
    controlObject.TypeId = $object_to_save.attr('data_control_type_id');

    console.log($parent.attr('data-response-id'));

    $.ajax({
        type: 'POST',
        url: baseLoc + '/AddControl',
        data: controlObject,
        dataType: 'json',
        async: false
    }).done(function (response) {
        $object_to_save.attr('data-response-id', response.id);
        console.log(response);
    });
}

function deleteObject(obj) {
    var $object_to_delete = obj.closest(".block_wrap");
    var id_to_delete = $object_to_delete.data('response-id');

    $.ajax({
        type: 'DELETE',
        url: baseLoc + '/DeleteControl',
        data: { id: id_to_delete },
    }).done(function (response) {
        $object_to_delete.remove();
        //console.log(response);

    });
}

function loadObject(obj) {
    var $object_to_load = obj;
    var id = $object_to_load.data('response-id');

    if (selectedControl !== null)
    {
        selectedControl.stop().css('background-color', '');
    }

    selectedControl = $object_to_load;

    var formBody = $('#settings-form');
    formBody.empty();

    $.ajax({
        type: 'GET',
        url: baseLoc + '/LoadControl',
        data: { id: id },
        success: function(settings) {

            if (settings)
            {
                $(formBody).empty();
                $(formBody).appendSettings(settings);

                $('<div></div>').addClass('form-group').append(
                    $('<div></div>').addClass('col-sm-offset-4 btn-toolbar col-sm-8 input-group').append(
                        $('<button></button>').attr('id', 'save-settings').addClass('waves-effect waves-light btn primarycolor primarycolorhover').text('Save').on('click', function (e)
                        {
                            e.preventDefault();
                            $(this).saveControlSettings();
                        }),
                        $('<button></button>').attr('id', 'delete-control').addClass('waves-effect waves-light btn btn-danger').text('Delete').on('click', function (e)
                        {
                            e.preventDefault();
                            deleteObject($object_to_load);
                        })
                    )
                ).appendTo(formBody);

                selectedControl.css('background-color', '#e4e4e4');

                //TODO: Add validation
                //$('#settings-form').formValidation();
            }
        },
        error: function (error)
        {
            selectedControl = null;
            console.log('error %s', error);
        }
    });
}

//Append setting during setting creation
$.fn.appendSettings = function (data)
{
    var setting = $('<div></div>').addClass('form-group').attr('id', 'settings_form');
    setting.append($('<div></div>').addClass('input-field').append(
        $('<input>')
            .addClass('validate')
            .attr('id', 'control_name')
            .attr('type', 'text')
            .val(data.alias),
        $('<label></label>')
            .addClass('active')
            .attr('for', 'control_name')
            .text('Alias')
    ));

    //selectOptions.append(
    //       $('<option disabled selected></option>')
    // .val('')
    // .text('Choose a reference'));
    var possibleMappings = JSON.parse(data.possibleMappings);

    if (possibleMappings.length > 0) {

        // if control is block or container, dont show this
        var selectOptions = $('<select></select>')
            .addClass('form-control')
            .attr('id', 'mapping_list')
            .attr('required', 'required');

        $.each(possibleMappings, function (index, value) {
            console.log(value.Name + ' - ' + value.Id);
            $selected = (value.Id == data.fieldMappingId) ? 'selected' : 0;
            $option = $('<option></option').val(value.Id).text(value.Name);

            if ($selected)
                $option.prop('selected', true);

            selectOptions.append($option);

        });

        selectOptions.val(data.FieldMappingId);


        setting.append($('<div style="margin: 15px 0;"></div>').addClass('input-field').append(
            selectOptions,
            $('<label></label>')
                .text('Mapping')
        ));

    }

    setting.append($('<div></div>').addClass('col-sm-7').append(
        $('<input>')
            .attr('id', 'show_label')
            .attr('type', 'checkbox')
            .prop('checked', data.labelVisible !== null && data.labelVisible === true ? 'checked' : ''),
        $('<label></label>')
            .attr('for', 'show_label')
            .text('Show Label')
    ));

    setting.append($('<div></div>').addClass('col-sm-7').append(
        $('<input>')
            .attr('id', 'show_help')
            .attr('type', 'checkbox')
            .prop('checked', data.helpVisible !== null && data.helpVisible === true ? 'checked' : ''),
        $('<label></label>')
            .attr('for', 'show_help')
            .text('Show Help')
    ));
    setting.appendTo(this);
    $('select').material_select();
}

//Save control's settings
$.fn.saveControlSettings = function ()
{
    if (selectedControl === null)
    {
        return;
    }

    if (selectingControl || savingControl)
    {
        return;
    }

    savingControl = true;

    var controlObject = {};
    var fieldMapping = $('#mapping_list').val() ? $('#mapping_list').val() : 0;
    controlObject.Id = selectedControl.data('response-id');
    controlObject.Alias = $('#control_name').val();
    controlObject.LabelVisible = $('#show_label').is(":checked");
    controlObject.HelpVisible = $('#show_help').is(":checked");
    controlObject.FieldMappingId = fieldMapping;

    selectedControl.find('label:first').html($('#control_name').val());

    $.ajax({
        type: "POST",
        url: baseLoc + "/SaveControlSettings",
        data: controlObject,
        dataType: 'json',
        success: function (result)
        {
            selectedControl.effect('highlight', {}, 1500);
            console.log(result);
            savingControl = false;
        },
        error: function (error)
        {
            console.log('error %s', error);
            savingControl = false;
        }
    });

    //TODO: change control title in form
    //selectedControl.find('.fieldname').text($('#settings-form input[name="name"]').val());
};

//Save control's settings
$.fn.saveControlPosition = function ()
{
    if (selectedControl === null)
    {
        return;
    }

    if (selectingControl || savingControl)
    {
        return;
    }

    savingControl = true;

    var controlObject = {};
    controlObject.Id = selectedControl.data('response-id');
    controlObject.PositionX = 0; //TODO: FILL
    controlObject.PositionY = 0; //TODO: FILL
    controlObject.Height = 0; //TODO: FILL
    controlObject.Width = 0; //TODO: FILL

    $.ajax({
        type: "POST",
        url: baseLoc + "/SaveControlPosition",
        data: controlObject,
        dataType: 'json',
        success: function (result)
        {
            selectedControl.effect('highlight', {}, 1500);
            console.log(result);
            savingControl = false;
        },
        error: function (error)
        {
            console.log('error %s', error);
            savingControl = false;
        }
    });

    //TODO: change control title in form
    //selectedControl.find('.fieldname').text($('#settings-form input[name="name"]').val());
};


$(document).on('click', "#frame .block_wrap", function (e) {
    e.stopPropagation();
    var obj = $(this);
    //console.log(obj.data('response-id'));
    loadObject(obj);
});

//Add element
function addElement(typeId, id_name, parent_id, element, object_id, options) {

    if (typeof object_id === "undefined")
        id++;
    else
        id = object_id;

    //element backend type id value
    var data_control_type_id = controls_types.indexOf("" + id_name + "");

    var parent = $("#" + parent_id);

    var classes = ['block_wrap'];

    if (typeId === 'block') {

        classes.push("row");

    } else if (typeId === 'container') {

        classes.push("col-xs-4", "column", "sortable");

    } else if (typeId === 'control') {

        classes.push("block", "clearfix", "fields");
    }

    for (var i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);
    }

    element.id = id;
    element.setAttribute('data_control_type_id', data_control_type_id);
    element.innerHTML = getInnerHtml(id_name);

    parent.append(element);

    var current_object = $("#" + id);

    if (typeof options !== "undefined") {
        console.log(options);
        current_object.find('label:first').html(options.alias);
    }

    //If save is true, we are saving object on backend
    if (save)
        result = saveObject(id);

    return id;
}

function myFunction(geeter) {
    var get_id = geeter;
    document.getElementById(get_id).classList.toggle("show");
}

function allowDrop(ev) {
    ev.preventDefault();
}

function getInnerHtml(data) {

    //var template;
    var template;

    //Get dragged element and set template for this element
    switch (data) {
        case 'Block':
            template = block;
            break;
        case 'Container':
            template = container;
            break;

        // Controls
        case 'Textbox':
            template = text_box;
            break;
        case 'TextArea':
            template = text_area;
            break;
        case 'HtmlEditor':
            template = html_editor;
            break;
        case 'Checkbox':
            template = check_box;
            break;
        case 'Datepicker':
            template = datapicker;
            break;
        case 'Dropdown':
            template = dropdown;
            break;
        case 'Radiobutton':
            template = radiobutton;
            break;
        case 'Lookup':
            template = lookup;
            break;
        case 'Grid':
            template = grid;
            break;
        case 'Label':
            template = label;
            break;
        // Fields
        case 'field_text':
            template = text_box;
            break;
        case 'field_area':
            template = text_area;
            break;
        case 'field_html':
            template = html_editor;
            break;
        case 'field_date':
            template = datapicker;
            break;
        case 'field_checkbox':
            template = check_box;
            break;
        case 'field_drop_down':
            template = dropdown;
            break;
        case 'field_radio_button':
            template = radiobutton;
            break;
        case 'field_number':
            template = field_number;
            break;
        case 'field_decimal':
            template = field_decimal;
            break;
        case 'group_field':
            template = group_field;
            break;
    }
    return template;
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function searchSidebar()
{
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('fieldSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("field_list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++)
    {
        a = li[i].getElementsByClassName("list-group-item")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1)
        {
            li[i].style.display = "";
        } else
        {
            li[i].style.display = "none";
        }
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var field_mapping_id = 0;

    //console.log(ev.target.attr('data-field-mapping-id'));
    // Create GRID
    var width = 80;
    var height = 40;
    var rows = 27;
    var cols = 12;

    //Create elements in grid
    var element = document.createElement("div");
    ev.target.appendChild(element);
    var get_frame = element.closest("div[id]").id;

    //Allow drop block in grid
    if (data === 'Block' && get_frame === 'frame') {
        addElement('block', data, get_frame, element);
    }

    //Allow drop container in block
    else if (data === 'Container' && element.parentNode.classList.contains("block_area")) {

        addElement('container', 'Container', '', element);

        let el_id = $(this).attr('id');
        resizeContainer(el_id);

    }

    //Allow drop container in grid
    else if (data === 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block', 'Block', 'frame', element);

        let element2 = document.createElement("div");

        $("#" + $block_id + " .block_area").append(element2);

        var $container_id = addElement('container', "Container", '', element2);

        let el_id = $(this).attr('id');
        resizeContainer(el_id);

        return element;
    }

    //Allow drop control & fields in container
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("blocks")) {
        element.setAttribute('data-field-mapping-id', field_mapping_id);
        let $control_id = addElement('control', data, '', element)
        return element;

    }

    //Allow drop control && fields in block
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("block_area")) {
        //add container
        let $container_id = addElement('container', 'Container', '', element);
        let el_id = $(this).attr('id');
        resizeContainer(el_id);
        //create new element
        let element2 = document.createElement("div");

        //append element to id root
        $("#" + $container_id + " .blocks").append(element2);

        //add element to proper parent
        element2.setAttribute('data-field-mapping-id', field_mapping_id);
        let $control_id = addElement('control', data, '', element2);

        return element;
    }

    //Allow drop control && fields in grid
    else if (data !== 'Block' && data !== 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block', 'Block', 'frame', element);

        var element2 = document.createElement("div");
        $("#" + $block_id + " .block_area").append(element2);
        let $container_id = addElement('container', 'Container', '', element2);
        let el_id = $(this).attr('id');
        resizeContainer(el_id);

        var element3 = document.createElement("div");
        $("#" + $container_id + " .blocks").append(element3);

        element3.setAttribute('data-field-mapping-id', field_mapping_id);
        let $control_id = addElement('control', data, '', element3);

        return element;
    }

    //Remove element if drop not allowed
    else {
        element.remove();
    }
}

// === Create templates ===

//Depositories

var block = "<div class='block_label'>" +
            "<label>Title</label>" +
            "</div>"+
            "<div class='block_area panel panel-default panel-body sortable'>" +
            "</div>";

var container = "<div class='blocks panel panel-default panel-body'>" + "</div>";

//Fields&Controls

var text_box = "<div class='items-fields input-field'>" +
    "<label for='text'>Text</label>" +
    "<input  type='text' class='validate field' disabled></div>";

var text_area = "<div class='items-fields input-field'>" +
    "<label for='textarea'>Textarea</label>" +
    "<textarea class='materialize-textarea field' disabled></textarea></div>";


var html_editor = "<div class='items-fields input-field'>" +
    "<label for='html'>HTML Editor</label>" +
    "<textarea class='materialize-textarea field' disabled></textarea></div>";


var check_box = "<div><form action='#'>" +
    "<p>" +
    "<input type='checkbox' class='field' id='test5' disabled/>" +
    "<label for='test5'>Red</label>" +
    "</p>" +
    "</form></div>";


var datapicker = "<div><input type='text' class='datepicker field'><label>Datepicker</label></div>";


var dropdown = "<div class='input-field field'>" +
    "<select>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='1'>Option 1</option>" +
    "<option value='2'>Option 2</option>" +
    "<option value='3'>Option 3</option>" +
    "</select>" +
    "<label>Materialize Select</label>" +
    "</div>";

var radiobutton = "<div><form action='#' class='field'>" +
    "<p>" +
    "<input name='group1' type='radio' id='test1' />" +
    "<label for='test1'>Red</label>" +
    "</p>" +
    "<p>" +
    "<input name='group1' type='radio' id='test2' />" +
    "<label for='test2'>Yellow</label>" +
    "</p>" +
    "<p>" +
    "<input class='with-gap' name='group1' type='radio' id='test3' />" +
    "<label for='test3'>Green</label>" +
    "</p>" +
    "<p>" +
    "<input name='group1' type='radio' id='test4' />" +
    "<label for='test4'>Brown</label>" +
    "</p>" +
    "</form></div>";
var lookup = "";
var grid = "";

var label = "<div class='items-fields'>" +
    "<label>Label</label>" +
    "</div>";

var field_number = "<div class='items-fields'>" +
    "<label for='num'>Number</label>" +
    "<input type='number' name='num' min='1' max='5'>" +
    "</div>";

var field_decimal = "<div class='items-fields'>" +
    "<label for='decimal'>Decimal</label>" +
    "<input type='number' required name='decimal' min='0' value='0' step='.01'>" +
    "</div>";

var group_field = "<div class='items-fields'>" +
    "<label for='text_box'>Text</label>" +
    "<input  type='text' class='validate' id='text_box'>" +
    "</div>" +
    "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
    "<span class='glyphicon glyphicon-remove'></span></div>" +
    "<div class='items-fields col s8'>" +
    "<label for='textarea'>Textarea</label>" +
    "<textarea class='materialize-textarea'></textarea>" +
    "</div>";


function resizeContainer(id){

    var card = $("#"+id);

    var padding_left = parseInt(card.css('padding-left'), 10);
    var padding_right = parseInt(card.css('padding-right'), 10);





     var block = card.parent().width() - (padding_left + padding_right)*2 ;
     var $prev_width = card.prev().width();
     var $prev_position = card.prev().position();
     var $prev_height = card.prev().height();


    card.css("width",'auto');

    if(typeof $prev_position !== 'undefined' && $prev_position.top === card.position().top && $prev_width < (block/2)){
        console.log('test');
        var check = block - $prev_width;
        console.log(check);
        card.css("width", check);
        card.height($prev_height);
    }else {
        card.css('width', '100%');
    }
}

function checkSiblings(elem) {

    var block = elem.closest('._container');
    var top_position = elem.position().top;


    $('.column', block).each(function () {
        var get_position = $(this).position().top;

        if (top_position === get_position) {

            $(this).height(elem.height());

        }
    })

}


$('#frame').on('mousedown', '.row', function () {

    $(".block_area").sortable({
        items: ".column",
        connectWith: '.block_area',
        revert: 150,
        update: function( event, ui ) {
            var element_id = $(this).parent().attr('id');
            console.log(element_id);
        }
    });
    $("#frame").sortable({
        axis: "y",
        items: ".row",
        containment:'parent',
        placeholder: 'block-placeholder',
        revert: 150
    });

    //Block Controls
    $(".blocks").sortable({
        axis: "y",
        items: '.items-fields',
        connectWith: '.blocks',
        update: function( event, ui ) {
            var element_id = $(this).parent().attr('id');
            console.log(element_id);
        }


    });


    $(".column").resizable({
        handles: "n, e, s, w",
        //grid: 80,
        //containment: "parent",
        resize: function (event, ui) {

            var el_id = $(this).attr('id');
            var cont = $("#"+el_id);

            if(ui.size.width >= cont.parent().width()){
                $(this).resizable('widget').trigger('mouseup');
            }

                cont.removeClass("resize_card");
            // Check if container contain fields
            if(cont.find(".fields").length > 0){

                var $check = $(this).find('.fields');

                $check.each(function () {
                    var set =$(this).width() ;
                    var $get_w = $(this).find('.field');

                    if($get_w.width() === set){
                        $get_w.addClass("fields_container");
                        $get_w.parent().addClass("fields_container");
                    } else{
                        $get_w.removeClass("fields_container");
                        $get_w.parent().removeClass("fields_container");
                    }
                });
            }
        },

        stop: function (event, ui) {

            var el_id = $(this).attr('id');
            var cont = $("#"+el_id);
            checkSiblings(cont);

        }

    });

    $( ".field" ).resizable({
        handles: " e, s",
        //grid: 80,
        //containment: ".block_area",
        start: function(event,ui){

        },
        resize: function(event,ui){

            $(this).removeClass('fields_container');
            $(this).parent().removeClass('fields_container');

            var $column = $(this).closest(".column");

            if($column.width() === $column.parent().width()){
                $(this).resizable('widget').trigger('mouseup');
            }



        },
        stop: function( event, ui ) {
            var el_id = $(this).closest('.column').attr('id');
            var cont = $("#"+el_id);
            cont.addClass("resize_card");

            checkSiblings(cont);

        }
    });




    var classname = $("glyphicon-remove");
    var delete_field = $(".glyphicon-remove");


    var myFunction = function () {
        $(this).closest('.column').remove();
    };
    var deleteField = function () {
        $(this).closest('.fields').remove();
    };


    $(".g-card").click(function () {
        $(".general").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".text_box").click(function () {
        $(".edit-text").show();
        $(".general, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".text_area").click(function () {
        $(".edit-textarea").show();
        $(".edit-text, .general, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".num").click(function () {
        $(".edit-number").show();
        $(".edit-text, .edit-textarea, .general, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".decimal").click(function () {
        $(".edit-decimal").show();
        $(".edit-text, .edit-textarea, .edit-number, .general, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".html").click(function () {
        $(".edit-html").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .general, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".check").click(function () {
        $(".edit-checkbox").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .general, .edit-date, .edit-radio").hide();
    });
    $(".drop").click(function () {
        $(".edit-drop").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .general, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".date").click(function () {
        $(".edit-date").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .general, .edit-radio").hide();
    });
    $(".radio").click(function () {
        $(".edit-radio").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .general").hide();
    });
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });
    //$('select').material_select();
});

loadContent();
//e.preventDefault();
