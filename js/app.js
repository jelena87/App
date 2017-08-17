//elements
var controls_types = ['Block', 'Container', 'Textbox', 'TextArea', 'HtmlEditor', 'Checkbox', 'Datepicker', 'Dropdown', 'Radiobutton', 'Lookup', 'Grid', 'Label'];

var id = 0;
//Add element
function addElement(type, id_name, parent_id, element){

    id = id + 1;

    //element backend type id value
    var data_control_type_id = controls_types.indexOf("" + id_name + "");

    var parent = $("#"+parent_id);

    var classes = ['block_wrap'];

    element.id = id;
    element.setAttribute('data_control_type_id',data_control_type_id);
    element.innerHTML = getInnerHtml(id_name);

    if(type === 'block') {


        classes.push("row","container");

    } else if(type === 'container') {

        classes.push("column", "sortable" );

    } else if(type === 'control') {

        classes.push("block","clearfix", "fields");
    }

    for (var i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);
    }



    parent.append(element);

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

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");


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

        var el_id = $(this).attr('id');
        resizeContainer(el_id);



    }
    //Allow drop container in grid
    else if (data === 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block','Block', 'frame', element);

        let element2 = document.createElement("div");
        $("#"+$block_id+" .block_area").append(element2);

        var $container_id = addElement('container', "Container", '', element2);

        var el_id = $(this).attr('id');
        resizeContainer(el_id);

        return element;
    }
    //Allow drop control & fields in container
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("blocks")) {

        let $control_id = addElement('control', data, '',element);
        return element;

    }
    //Allow drop control && fields in block
    else if (data !== 'Block' && data !== 'Container' && element.parentNode.classList.contains("block_area")) {
        //add container
        let  $container_id = addElement('container', 'Container', '', element);

        //create new element
        let element2 = document.createElement("div");

        //append element to id root
        $("#"+$container_id+" .blocks").append(element2);

        //add element to proper parent
        let $control_id = addElement('control', data, '', element2);

        return element;
    }
    //Allow drop control && fields in grid
    else if (data !== 'Block' && data !== 'Container' && element.closest("div[id]").id === 'frame') {

        let $block_id = addElement('block','Block', 'frame', element);

        var element2 = document.createElement("div");
        $("#"+$block_id+" .block_area").append(element2);
        let  $container_id = addElement('container', 'Container', '', element2);

        var element3 = document.createElement("div");
        $("#"+$container_id+" .blocks").append(element3);

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

var block="<div class='block_area panel panel-default panel-body sortable'>" +
    "</div>";

var container = "<div class='blocks panel panel-default panel-body'>" +
    //"<div class='title_card'>" +
    // "<div class='right'>" +
    // "<span class='glyphicon glyphicon-pencil g-card'></span>" +
    // "<span class='glyphicon glyphicon-trash'></span>" +
    // "</div>" +
    //"</div>"+
    //"</div>" +
    "</div>";

//Fields&Controls

var text_box = "<div class='items-fields input-field'>" +
    "<label for='text'>Text</label>" +
    "<input  type='text' class='validate field' disabled></div>";
    // "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
    // "<span class='glyphicon glyphicon-remove'></span></div>";

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
    "</div>" ;

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
    "</div>" ;

var field_number = "<div class='items-fields'>" +
    "<label for='num'>Number</label>" +
    "<input type='number' name='num' min='1' max='5'>" +
    "</div>" ;

var field_decimal = "<div class='items-fields'>" +
    "<label for='decimal'>Decimal</label>" +
    "<input type='number' required name='decimal' min='0' value='0' step='.01'>" +
    "</div>" ;

var group_field = "<div class='items-fields'>" +
    "<label for='text_box'>Text</label>" +
    "<input  type='text' class='validate' id='text_box'>" +
    "</div>" +
    "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
    "<span class='glyphicon glyphicon-remove'></span></div>" +
    "<div class='items-fields col s8'>" +
    "<label for='textarea'>Textarea</label>" +
    "<textarea class='materialize-textarea'></textarea>" +
    "</div>" ;



function resizeContainer(id){

    var cont = $("#"+id);
    cont.css("width",'auto');
    var $prev_width = cont.prev().width();
    var $prev_height = cont.prev().height();

    if($prev_width < 450){
        var check = 920 - $prev_width;
        cont.css("width", check );
        cont.height($prev_height);
    }
    if($prev_width > 900 &&  cont.position().left === 0){
        cont.css('width', '100%');
    }
}

$('#frame').on('mousedown', '.row', function () {

    $(".block_area").sortable({
        items: ".column",
        revert: 50
    });
    $("#frame").sortable({
        axis: "y",
        items: ".row",
        placeholder: 'block-placeholder',
        revert: 150
    });

    // Block Controls
    $(".blocks").sortable({
        connectWith: '.blocks',
        placeholder: 'block-placeholder',
        revert: 50
    });


    $(".column").resizable({
        handles: "e, s",
        start: function (event, ui) {
            var el_id = $(this).attr('id');
            var cont = $("#"+el_id);
            cont.removeClass("resize_card");
        }
    });

    $( ".field" ).resizable({
        handles: " e, s",
        stop: function( event, ui ) {
            var el_id = $(this).closest('.column').attr('id');
            //container
            var cont = $("#"+el_id);
            cont.addClass("resize_card");

           var left_position = cont.position().left;


            var $const = cont.height();
            var $prev = cont.prev().height();
            var $next = cont.next().height();
           

            var $const_width = cont.width();

            if(left_position === 0 && $const_width > 910){
                cont.prevAll().height($prev);
                cont.next().height($next);
                return $const;
            }
            if(left_position === 0 && typeof cont.next().position().left !=='undefined' && cont.next().position().left !== 0  ){
                cont.next().height($const);
            }
            if(typeof cont.prev().position().left !== undefined && cont.prev().position().left === 0){
                cont.height($const);
                cont.prev().height($prev);
            }
            if(typeof cont.prev().position().left !== undefined &&  cont.prev().position().left !== 0){
                cont.height($prev);
                if(typeof cont.next().position().left !=='undefined' && cont.next().position().left !== 0){
                    cont.next().height($$const);
                }
            }


        }
    });



    var classname = $(".glyphicon-trash");
    var delete_field = $(".glyphicon-remove");


    var myFunction = function () {
        $(this).closest('.column').remove();
    };
    var deleteField = function () {
        $(this).closest('.fields').remove();
    };


    Array.from(classname).forEach(function (element) {
        element.addEventListener('click', myFunction);
    });
    Array.from(delete_field).forEach(function (element) {
        element.addEventListener('click', deleteField);
    });


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
    $('select').material_select();
});
