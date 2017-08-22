var baseLoc = window.location;
var id = 0;
var save = false;
var controls_types = ['Block', 'Container', 'Textbox', 'TextArea', 'HtmlEditor', 'Checkbox', 'Datepicker', 'Dropdown', 'Radiobutton', 'Lookup', 'Grid', 'Label'];
var selectedControl = null;
var selectingControl = false;
var savingControl = false;
var update_column_w;
var resize_step = parseInt(parseInt($('#frame').width()) / 12);

var ControlSettingTypes = {
    ALIAS: 0,
    MAPPING: 1,
    SHOWLABEL: 2,
    SHOWHELP: 3
}

//Add element
function addElement(typeId, id_name, parent_id, element, object_id, options) {

    // Load Objects from DB
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

        classes.push("col-xs-12", "column", "sortable");
        element.setAttribute('data-number-of-columns', 12);
        element.setAttribute('data-class', 'col-md-12');

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
        let alias = options.alias ? options.alias : id_name;
        current_object.find('label:first').html(alias);

        if (options.typeId != 0)
            element.style.height = options.height + "px";

        if (options.typeId > 1) {
            current_object.find('.items-fields').attr('data-width', options.width);
        } else {
            //element.style.width = options.width + "px";
        }

        var responsive_class = options.clientClass ? options.clientClass : 'col-md-12';

        current_object.attr('data-position', options.order);
        current_object.attr('data-class', responsive_class);
        current_object.attr('data-number-of-columns', responsive_class.substring(7));

        if (options.typeId == 1) {
            current_object.addClass(responsive_class);
        } else if (options.typeId > 1) {
            current_object.addClass('col-md-12');
            var items_fields = current_object.find('.items-fields');
            items_fields.removeClass('col-md-12').addClass(responsive_class);
            items_fields.attr('data-class', responsive_class);
            items_fields.attr('data-number-of-columns', 12);
        }

    } else {
        element.classList.add('col-md-12');
        if (!current_object.attr('data-position')) {
            current_object.attr('data-position', current_object.index());
        }

        if (typeId === 'control') {
            var items_fields = current_object.find('.items-fields');
            items_fields.attr('data-class', 'col-md-12');
            items_fields.attr('data-number-of-columns', 12);
        }

        current_object.find('label:first').html(id_name);
        element.setAttribute('data-alias', id_name);
    }

    initializeSortableDraggable(current_object);

    //If save is true, we are saving object on backend
    if (save)
        result = saveObject(id);

    return id;
}

function loadContent() {
    var blocks = $.parseJSON(blockJsonObj);
    var containers = $.parseJSON(containerJsonObj);
    var controls = $.parseJSON(controlJsonObj);
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
}

$(document).on('click', "#frame div.delete_control", function (e) {
    e.stopPropagation();
    deleteObject($(this));
});


function saveObject($id) {
    var $object_to_save = $("#" + $id);
    var $parent = $object_to_save.parent().closest(".block_wrap");

    var x = $object_to_save.offset().left - $parent.offset().left;
    var y = $object_to_save.offset().top - $parent.offset().top;

    var controlObject = {};
    controlObject.PositionX = x;
    controlObject.PositionY = y;
    controlObject.Width = $object_to_save.outerWidth();
    controlObject.Height = $object_to_save.outerHeight();
    controlObject.FieldMappingId = $object_to_save.attr('data-field-mapping-id') ? $object_to_save.attr('data-field-mapping-id') : 0;
    controlObject.ParentControlId = $parent.attr('data-response-id');
    controlObject.Order = parseInt($object_to_save.attr('data-position'));
    controlObject.TypeId = $object_to_save.attr('data_control_type_id');
    controlObject.Alias = $object_to_save.attr('data-alias');
    if ($object_to_save.hasClass('block'))
        controlObject.ClientClass = $object_to_save.find('.items-fields').attr('data-class');
    else
        controlObject.ClientClass = $object_to_save.attr('data-class');

    $.ajax({
        type: 'POST',
        url: baseLoc + '/AddControl',
        data: controlObject,
        dataType: 'json',
        async: false
    }).done(function (response) {
        $object_to_save.attr('data-response-id', response.id);
    });
}

function deleteObject(obj) {
    var $object_to_delete = obj.closest(".block_wrap");
    var id_to_delete = $object_to_delete.attr('data-response-id');

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
    var id = $object_to_load.attr('data-response-id');

    if (selectedControl !== null) {
        selectedControl.stop().css('background-color', '');
    }

    selectedControl = $object_to_load;

    var formBody = $('#settings-form');
    formBody.empty();

    $.ajax({
        type: 'GET',
        url: baseLoc + '/LoadControl',
        data: { id: id },
        success: function (settings) {

            if (settings) {
                $(formBody).empty();
                $(formBody).appendSettings(settings);

                $('<div></div>').addClass('form-group').append(
                    $('<div></div>').addClass('col-sm-offset-4 btn-toolbar col-sm-8 input-group').append(
                        $('<button></button>').attr('id', 'save-settings').addClass('waves-effect waves-light btn primarycolor primarycolorhover').text('Save').on('click', function (e) {
                            e.preventDefault();
                            $(this).saveControlSettings();
                        })
                    )
                ).appendTo(formBody);
                $('.delete_control').hide();
                selectedControl.css('background-color', '#e4e4e4');
                selectedControl.find('.delete_control:first').show();


                //TODO: Add validation
                //$('#settings-form').formValidation();
            }
        },
        error: function (error) {
            selectedControl = null;
            //console.log('error %s', error);
        }
    });
}

//Append setting during setting creation
$.fn.appendSettings = function (data) {
    var setting = $('<div></div>').addClass('form-group').attr('id', 'settings_form');
    setting.append($('<div></div>').addClass('input-field').append(
        $('<label></label>')
            .addClass('active')
            .attr('for', 'control_name')
            .text('Alias'),
        $('<input>')
            .addClass('validate')
            .attr('id', 'control_name')
            .attr('type', 'text')
            .val(data.alias)

    ));

    var possibleMappings = JSON.parse(data.possibleMappings);

    if (possibleMappings.length > 1000) {

        // if control is block or container, dont show this
        var selectOptions = $('<select></select>')
            .addClass('form-control')
            .attr('id', 'mapping_list')
            .attr('required', 'required');

        $.each(possibleMappings, function (index, value) {
            $selected = (value.Id == data.fieldMappingId) ? 'selected' : 0;
            $option = $('<option></option').val(value.Id).text(value.Name);

            if ($selected)
                $option.attr('selected', 'selected');

            selectOptions.append($option);

        });

        selectOptions.val(data.FieldMappingId);

        setting.append($('<div style="margin: 15px 0;"></div>').addClass('input-field').append(
            selectOptions,
            $('<label></label>')
                .text('Mapping')
        ));

    }

    setting.append($('<div></div>').append(
        $('<input>')
            .attr('id', 'show_label')
            .attr('type', 'checkbox')
            .prop('checked', data.labelVisible !== null && data.labelVisible === true ? 'checked' : ''),
        $('<label></label>')
            .attr('for', 'show_label')
            .text('Show Label')
    ));

    setting.append($('<div></div>').append(
        $('<input>')
            .attr('id', 'show_help')
            .attr('type', 'checkbox')
            .prop('checked', data.helpVisible !== null && data.helpVisible === true ? 'checked' : ''),
        $('<label></label>')
            .attr('for', 'show_help')
            .text('Show Help')
    ));
    setting.appendTo(this);
    $("#control-settings-wrap").show();
    $('#control-settings-wrap select').material_select();
}

//Save control's settings
$.fn.saveControlSettings = function () {
    if (selectedControl === null) {
        return;
    }

    if (selectingControl || savingControl) {
        return;
    }

    savingControl = true;

    var controlObject = {};
    var fieldMapping = $('#mapping_list').val() ? $('#mapping_list').val() : 0;
    controlObject.Id = selectedControl.attr('data-response-id');
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
        success: function (result) {
            selectedControl.effect('highlight', {}, 1500);
            savingControl = false;
        },
        error: function (error) {
            //console.log('error %s', error);
            savingControl = false;
        }
    });

    //TODO: change control title in form
    //selectedControl.find('.fieldname').text($('#settings-form input[name="name"]').val());
};

//Save control's settings
$.fn.saveControlPosition = function () {
    var selectedControl = $(this);
    var parent = selectedControl.parent().closest(".block_wrap");

    if (selectedControl === null) {
        return;
    }

    /*if (selectingControl || savingControl)
     {
     return;
     }

     savingControl = true; */

    var controlObject = {};
    controlObject.Id = selectedControl.attr('data-response-id');
    controlObject.Order = selectedControl.attr('data-position');
    controlObject.PositionX = 0; //TODO: FILL
    controlObject.PositionY = 0; //TODO: FILL
    controlObject.Height = selectedControl.outerHeight();
    controlObject.ClientClass = selectedControl.attr('data-class');

    if (selectedControl.attr('data_control_type_id') > 1) {
        controlObject.ClientClass = selectedControl.find('.items-fields').attr('data-class');
        var ui_wrapper = selectedControl.find('.ui-wrapper');
        controlObject.Width = ui_wrapper.outerWidth();
    } else {
        controlObject.Width = selectedControl.outerWidth();
    }

    controlObject.ParentControlId = parent.attr('data-response-id');

    $.ajax({
        type: "POST",
        url: baseLoc + "/SaveControlPosition",
        data: controlObject,
        dataType: 'json',
        //async: false,
        success: function (result) {
            selectedControl.effect('highlight', {}, 1500);
            //savingControl = true;
        },
        error: function (error) {
            //console.log('error %s', error);
            savingControl = false;
        }
    });

    //TODO: change control title in form
    //selectedControl.find('.fieldname').text($('#settings-form input[name="name"]').val());
};


$(document).on('click', "#frame .block_wrap", function (e) {
    e.stopPropagation();
    var obj = $(this);

    loadObject(obj);
});

$('#drop_depositories').show();

function myFunction(geeter) {
    $('.dropdown-content-wrap').hide();
    var get_id = geeter;
    $('#' + get_id).show();
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

function searchSidebar() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('fieldSearch');
    filter = input.value.toUpperCase();
    li_parent = document.getElementById("fileds_wrap");
    p = li_parent.getElementsByClassName('field_name_wrap');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < p.length; i++) {
        //console.log(li[i]);
        a = p[i].getElementsByClassName("fieldname")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            p[i].style.display = "";
        } else {
            p[i].style.display = "none";
        }
    }
}

function insert_field_group(ev, field_group_elements, root_element) {

    field_group_elements = jQuery.parseJSON(field_group_elements);

    $.each(field_group_elements, function (index, obj) {
        var element_to_insert = document.createElement("div");
        ev.target.appendChild(element_to_insert);

        if (typeof root_element !== 'undefined')
            root_element.append(element_to_insert);

        element_to_insert.setAttribute('data-field-mapping-id', obj.field_mapping_id);
        let $control_id = addElement('control', obj.type, '', element_to_insert);
    });
}

function dragEnter(event) {
    event.target.style.backgroundColor = "#e2e2e2";
}

function dragLeave(event) {
    event.target.style.backgroundColor = "";
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.target.style.backgroundColor = "";
    ev.preventDefault();
    ev.stopPropagation();
    var data = ev.dataTransfer.getData("text");

    var field_mapping_id = 0;

    dragged_element = $("#" + data + "");

    if (dragged_element.attr("data-type")) {
        data = dragged_element.attr("data-type");
        field_mapping_id = dragged_element.attr('data-field-mapping-id');

        if (data == 'fieldGroup') {
            var field_group_elements = dragged_element.attr('data-elements');
        }
    }

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
        let get_poz_y = event.offsetY;
        resizeContainer(el_id, get_poz_y);
    }

    //Allow drop container in grid
    else if (data === 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block', 'Block', 'frame', element);

        let element2 = document.createElement("div");

        $("#" + $block_id + " .block_area").append(element2);

        var $container_id = addElement('container', "Container", '', element2);

        let el_id = $(this).attr('id');
        let get_poz_y = event.offsetY;
        resizeContainer(el_id, get_poz_y);

        return element;
    }

    //Allow drop control & fields in container
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("blocks")) {

        if (data == 'fieldGroup') {
            insert_field_group(ev, field_group_elements);
        } else {
            element.setAttribute('data-field-mapping-id', field_mapping_id);
            let $control_id = addElement('control', data, '', element);

            var cont = $("#" + $control_id).closest('.column').attr('id');
            var send_element = $("#" + cont);
            checkSiblings(send_element);

        }

        return element;
    }

    //Allow drop control && fields in block
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("block_area")) {
        //add container
        let $container_id = addElement('container', 'Container', '', element);
        let el_id = $(this).attr('id');
        let get_poz_y = event.offsetY;
        resizeContainer(el_id, get_poz_y);

        let root_element = $("#" + $container_id + " .blocks");

        if (data == 'fieldGroup') {
            insert_field_group(ev, field_group_elements, root_element);
        } else {
            //create new element
            let element2 = document.createElement("div");

            //append element to id root
            root_element.append(element2);
            //add element to proper parent
            element2.setAttribute('data-field-mapping-id', field_mapping_id);
            let $control_id = addElement('control', data, '', element2);
        }

        return element;
    }

    //Allow drop control && fields in grid
    else if (data !== 'Block' && data !== 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block', 'Block', 'frame', element);

        var element2 = document.createElement("div");
        $("#" + $block_id + " .block_area").append(element2);
        let $container_id = addElement('container', 'Container', '', element2);
        let el_id = $(this).attr('id');
        let get_poz_y = event.offsetY;
        resizeContainer(el_id, get_poz_y);

        let root_element = $("#" + $container_id + " .blocks");

        if (data == 'fieldGroup') {
            insert_field_group(ev, field_group_elements, root_element);
        } else {
            var element3 = document.createElement("div");
            root_element.append(element3);

            element3.setAttribute('data-field-mapping-id', field_mapping_id);
            let $control_id = addElement('control', data, '', element3);
        }
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
    "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "</div>" +
    "<div class='block_area panel panel-default panel-body sortable'>" +
    "</div>";

var container = "<div class='blocks panel panel-default panel-body'>" +
    "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "</div>";

//Fields&Controls

var text_box = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field col-md-12'>" +
    "<label for='text'>Text</label>" +
    "<input  type='text' class='validate field' disabled></div>";

var text_area = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field col-md-12'>" +
    "<label for='textarea'>Textarea</label>" +
    "<textarea class='materialize-textarea field' disabled></textarea></div>";


var html_editor = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field col-md-12'>" +
    "<label for='html'>HTML Editor</label>" +
    "<textarea class='materialize-textarea field' disabled></textarea></div>";


var check_box = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='temp_checkbox items-fields input-field col-md-12'>" +
    "<form action='#'>" +
    "<p>" +
    "<input type='checkbox' id='test7'  disabled='disabled' />"+
    "<label for='test7'>Checkbox</label>" +
    "</p>" +
    "</form>" +
    "</div>";


var datapicker = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field col-md-12'>" +
    "<label>Datepicker</label>" +
    "<input type='text' class='datepicker field' disabled='disabled'>" +
    "</div>";




var dropdown = "<div class='delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='temp_dropdown items-fields field col-md-12'>" +
    "<p>"+
    "<a class='dropdown-button btn' href='#' data-activates='dropdown1' disabled='disabled'>Dropdown</a>" +
    "</p>" +
        "<ul id='dropdown1' class='dropdown-content'>"+
            "<li><a href='#!'>one</a></li>" +
            "<li><a href='#!'>two</a></li>"+
            "<li class='divide'></li>"+
            "<li><a href='#!'>three</a></li>"+
            "<li><a href=''#!'><i class='material-icons'>view_module</i>four</a></li>"+
            "<li><a href='#!'><i class='material-icons'>cloud</i>five</a></li>" +
        "</ul>"+
    "</div>";


var radiobutton = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='temp_radiobtn items-fields input-field col-md-12'>" +
    "<form action='#' disabled>" +
            "<input name='group1' type='radio'  />" +
            "<label>Red</label>" +
        "</br>" +
            "<input name='group1' type='radio'/>" +
            "<label>Yellow</label>" +
        "</br>" +
            "<input class='with-gap' name='group1' type='radio' />" +
            "<label>Green</label>" +
        "</br>" +
            "<input name='group1' type='radio' />" +
            "<label>Brown</label>" +
        "</br>" +
    "</form>" +
    "</div>";

var lookup = "<div class='delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='temp_dropdown items-fields field col-md-12'>" +
    "<p>"+
    "<a class='dropdown-button btn' href='#' data-activates='dropdown1' disabled='disabled'>Lookup</a>" +
    "</p>" +

    "<ul id='dropdown1' class='dropdown-content'>"+
    "<li><a href='#!'>one</a></li>" +
    "<li><a href='#!'>two</a></li>"+
    "<li class='divide'></li>"+
    "<li><a href='#!'>three</a></li>"+
    "<li><a href=''#!'><i class='material-icons'>view_module</i>four</a></li>"+
    "<li><a href='#!'><i class='material-icons'>cloud</i>five</a></li>" +
    "</ul>"+
    "</div>";
var grid = "<div class=' delete_control'>" +
                "<span class='glyphicon glyphicon-remove'></span>" +
           "</div>" +
           "<div class='temp_grid items-fields field col-md-12'>" +
            "<table class='table' disabled>" +
                "<thead>" +
                    "<tr>" +
                        "<th>State</th>" +
                        "<th>Area</th>" +
                        "<th>Country</th>" +
                        "<th>Location</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>" +
                "</tbody>" +
            "</table>" +
           "</div>";

var label = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='temp_label items-fields field col-md-12'>" +
    "<label>Label</label>" +
    "</div>";

var field_number = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field field col-md-12'>" +
    "<label for='num'>Number</label>" +
    "<input type='number' name='num' min='1' max='5'>" +
    "</div>";

var field_decimal = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields input-field field col-md-12'>" +
    "<label for='decimal'>Decimal</label>" +
    "<input type='number' required name='decimal' min='0' value='0' step='.01'>" +
    "</div>";

var group_field = "<div class=' delete_control'>" +
    "<span class='glyphicon glyphicon-remove'></span>" +
    "</div>" +
    "<div class='items-fields col-md-12'>" +
    "<label for='text_box'>Text</label>" +
    "<input  type='text' class='validate' id='text_box'>" +
    "</div>" +
    "<div><span class='glyphicon glyphicon-cog text_box'></span>" +
    "<span class='glyphicon glyphicon-remove'></span></div>" +
    "<div class='items-fields col s8'>" +
    "<label for='textarea'>Textarea</label>" +
    "<textarea class='materialize-textarea'></textarea>" +
    "</div>";


/* Templates END */


function resizeContainer(id, position) {

    var card = $("#" + id);

    var prev_element_columns = parseInt(card.prev().attr('data-number-of-columns'));
    var $prev_position = card.prev().position();
    var $prev_height = card.prev().height();
    var pos = position;


    if (prev_element_columns > 0 && prev_element_columns <= 6 && pos < ($prev_position.top + $prev_height)) {

        var number_of_columns = 12 - prev_element_columns;
        card.attr('data-number-of-columns', number_of_columns);
        var new_class = 'col-md-' + number_of_columns;

        card.addClass(new_class);
        card.removeClass(card.attr('data-class'));
        card.attr('data-class', new_class);
        card.height($prev_height);
        card.saveControlPosition();

    }
}

function checkSiblings(elem) {

    var block = elem.closest('.block_area');
    var top_position = elem.position().top;

    $('.column', block).each(function () {
        var get_position = $(this).position().top;

        if (top_position === get_position) {
            if ($(this).height() > elem.height()) {
                elem.height($(this).height());
            }
            else {
                $(this).height(elem.height());
                if (elem.attr('id') != $(this).attr('id'))
                    $(this).saveControlPosition();
            }

        }
    })
}


$.fn.updatePositions = function () {
    var obj = $(this);
    if ($(this).attr('id') == 'frame') {
        child = 'row';
    } else if ($(this).hasClass('block_area')) {
        child = 'column';
    } else if ($(this).hasClass('column')) {
        $(this).saveControlPosition();
        child = 'block';
    } else {
        child = 'block';
    }
    obj.find('div.' + child).each(function (i, div) {
        let obj2 = $(div);
        obj2.attr('data-position', i);
        var result = obj2.saveControlPosition();
    });
};

function sortableInitialize(obj) {
    console.log(obj.attr('class'));
    //Main Frame
    if (obj.attr('id') == 'frame') {
        obj.sortable({
            axis: "y",
            items: ".row",
            containment: 'parent',
            placeholder: 'block-placeholder',
            revert: 150,
            update: function (event, ui) {
                $('#frame').updatePositions();
            }
        });
    } else if (obj.hasClass('row')) {

        //Containers
        $('.block_area').sortable({
            items: ".column",
            axis: "x,y",
            connectWith: '.block_area',
            revert: 150,
            update: function (event, ui) {
                var el_id = $(this).attr('id');
                var cont = $("#" + el_id);
                //checkSiblings(cont);
                $(this).updatePositions();
            }
        });
    } else if (obj.hasClass('column')) {
        var parent = obj.find('.blocks');

        // Container Controls
        parent.sortable({
            axis: "x,y",
            items: ".block",
            connectWith: '.blocks',
            update: function (event, ui) {
                var el_id = $(this).attr('id');
                var cont = $("#" + el_id);
                //checkSiblings(cont);
                $(this).updatePositions();
            },
            receive: function (e, div) {
                var set = $("#" + div.item.attr('id'));
                var item_fields = set.find(".items-fields");
                var remove = item_fields.attr('data-class');

                item_fields.removeClass(remove);
                item_fields.addClass('col-md-12');
                item_fields.attr('data-class', 'col-md-12');
                item_fields.attr('data-number-of-columns', '12');

            }
        });
    }
}

function resizableInitialize(obj) {

    if (obj.hasClass('column')) {
        // Container resize
        obj.resizable({
            handles: "e, s",
            grid: [resize_step, 40],
            cursor: 'move',
            resize: function (event, ui) {

                var obj = $(this);


                //Get direction of moving by width and handles 'e'
                if ($(this).data('ui-resizable').axis === 'e') {
                    var currentWidth = ui.size.width;
                    var direction = (currentWidth > window.resizeWidth) ? 'right' : 'left';
                    window.resizeWidth = ui.size.width;

                    // Check if container contain fields
                    if (obj.find(".fields").length > 0) {

                        var $check = $(this).find('.fields');


                        $check.each(function () {
                            var set = $(this).width();

                            var $get_w = $(this).find('.field');

                            if ($get_w.width() === set) {
                                $get_w.addClass("fields_container");
                                $get_w.parent().addClass("fields_container");
                            } else {
                                $get_w.removeClass("fields_container");
                                $get_w.parent().removeClass("fields_container");
                            }
                        });
                    }

                    //Get number of columns att value
                    var number_of_columns = parseInt(obj.attr('data-number-of-columns'));

                    if (direction === 'right') {

                        if (number_of_columns == 12) {
                            $(this).resizable('widget').trigger('mouseup');

                        } else {
                            number_of_columns = number_of_columns + 1;
                        }

                    } else if (direction === 'left') {
                        if (number_of_columns == 1) {

                        } else {
                            number_of_columns = number_of_columns - 1;
                        }
                    }

                    obj.attr('data-number-of-columns', number_of_columns);
                    var new_class = 'col-md-' + number_of_columns;

                    obj.addClass(new_class);
                    obj.removeClass(obj.attr('data-class'));
                    obj.attr('data-class', new_class);

                    $(this).width('');
                }

            },
            stop: function (event, ui) {

                var cont = $("#" + ($(this).attr('id')));
                checkSiblings(cont);

                var parent_wrap = $(this).closest(".block_wrap");
                parent_wrap.updatePositions();

                $(this).width('');
                $(this).find('.fields').width('');
            }

        });
    } else if (obj.hasClass('fields')) {
        var field = obj.find('.field');

        // Controls resize
        field.resizable({
            handles: "e, s",
            grid: [20, 40],
            containment: ".block_wrap",
            create: function (event, ui) {
               // $(this).material_select();
                $(this).width('');
                $(this).find('.field').width('');
            },
            resize: function (event, ui) {

                var step = parseInt(parseInt($(this).closest('div.block').width()) / 12);
                var grid = $(this).resizable("option", "grid");
                var obj = $(this).parent();


                if (grid[0] != step) {
                    $(this).resizable("option", "grid", [step, 40]);
                    console.log(step + 'step');
                }



                if ($(this).data('ui-resizable').axis === 'e') {

                    var currentWidth = ui.size.width;
                    console.log(currentWidth);
                    var direction = (currentWidth > window.resizeWidth) ? 'right' : 'left';
                    window.resizeWidth = ui.size.width;

                    //Get number of columns att value
                    var number_of_columns = parseInt(obj.attr('data-number-of-columns'));

                    if (direction === 'right') {

                        if (number_of_columns === 12) {
                            $(this).resizable('widget').trigger('mouseup');

                        } else {
                            number_of_columns = number_of_columns + 1;
                        }

                    } else if (direction === 'left') {
                        if (number_of_columns === 1) {

                        } else {
                            number_of_columns = number_of_columns - 1;
                        }
                    }

                    obj.attr('data-number-of-columns', number_of_columns);
                    var new_class = 'col-md-' + number_of_columns;

                    obj.addClass(new_class);
                    obj.removeClass(obj.attr('data-class'));
                    obj.attr('data-class', new_class);

                    $(this).width('');
                }
            },
            stop: function (event, ui) {

                var cont = $("#" + ($(this).closest('.column').attr('id')));
                checkSiblings(cont);

                var parent_wrap = $(this).closest(".block_wrap.column");
                parent_wrap.updatePositions();

                $(this).width('');
                $(this).find('.field').width('');
                //$(this).closest('.block_wrap').width('100%'); ui-wrapper,ui-resizable

            }
        });
    }
}

function initializeSortableDraggable(obj) {
    sortableInitialize(obj);
    resizableInitialize(obj);
}
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
});
$('#framew').on('mousedown', '.row', function () {

    /* var classname = $("glyphicon-remove");
     var delete_field = $(".glyphicon-remove");

     var myFunction = function () {
     $(this).closest('.column').remove();
     };
     var deleteField = function () {
     $(this).closest('.fields').remove();
     }; */


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
document.getElementById('fieldSearch').addEventListener('keyup', searchSidebar);
loadContent();
initializeSortableDraggable($("#frame"));