
//Add element
function addElement(type, id_name, parent_id, element){

    id = id + 1;

    var parent = $("#"+parent_id);

    var classes = ['block_wrap'];

    if(type === 'block') {

        classes.push("row");
    }
    else if(type === 'container') {
        classes.push("col-xs-4","column", "sortable" );
    }
    else if(type === 'control') {

        classes.push("block","clearfix", "fields");
    }

    for (var i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);

    }
    console.log(element.classList)
    element.id = id;
    element.innerHTML = getInnerHtml(id_name);

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

        var template;
        //Get dragged element and set template for this element
        switch (data) {
            case 'drag1':
                template = block;
                break;
            case 'drag2':
                template = container;
                break;
            case 'block_container':
                template = block_container;
                break;
            // Controls
            case 'text_box':
                template = text_box;
                break;
            case 'text_area':
                template = text_area;
                break;
            case 'html_editor':
                template = html_editor;
                break;
            case 'check_box':
                template = check_box;
                break;
            case 'datapicker':
                template = datapicker;
                break;
            case 'dropdown':
                template = dropdown;
                break;
            case 'radiobutton':
                template = radiobutton;
                break;
            case 'lookup':
                template = lookup;
                break;
            case 'grid':
                template = grid;
                break;
            case 'label':
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

    var id = 0;
    var block_id = 100;
    var get_block;


    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");

        // Create GRID
        var width = 80;
        var height = 40;
        var rows = 27;
        var cols = 12;

        for (var i = 0; i < rows * cols; i++) {
            var y = Math.floor(i / cols) * height;
            var x = (i * width) % (cols * width);
            $("<div grid-cell></div>").css({top: y, left: x}).prependTo(frame);
        }



        var drag_depo = ['drag1', 'drag2'];
        var drag_cont = ['text_box', 'text_area', 'html_editor', 'check_box',
            'datapicker', 'dropdown', 'radiobutton', 'lookup', 'grid', 'label', 'field_text', 'field_area',
            'field_date', 'field_number', 'field_drop_down', 'field_checkbox', 'field_radio_button', 'field_decimal', 'group_field', 'field_html'];
        var isLeft;
        if (drag_depo.includes(data)) {
            isLeft = 'depositories';
        }
        if (drag_cont.includes(data)) {
            isLeft = 'controls';
        }


        if (isLeft === 'depositories') {

            //create elements in grid
            var element = document.createElement("div");
            ev.target.appendChild(element);
            var get_frame = element.closest("div[id]").id;


            if (data === 'drag1' && get_frame === 'frame') {
                addElement('block', data, get_frame, element);
            }

            else if (data === 'drag2' && element.parentNode.classList.contains("block_area")) {

                addElement('container', 'drag2', '', element);

            }
            else if (data === 'drag2' && element.closest("div[id]").id === 'frame') {

                var $block_id = addElement('block','drag1', 'frame', element);

                var element2 = document.createElement("div");
                $("#"+$block_id+" .block_area").append(element2);

                var $container_id = addElement('container', "drag2", '', element2);

                return element;
            }
            else {
                element.remove();
            }

        }
        if (isLeft === 'controls') {

            var element = document.createElement("div");
            ev.target.appendChild(element);



            if (element.parentNode.classList.contains("blocks")) {

                var $control_id = addElement('control', data, '',element)
                return element;

            }
            if (element.parentNode.classList.contains("block_area")) {
                //add container
                var  $container_id = addElement('container', 'drag2', '', element);
                //create new element
                var element2 = document.createElement("div");
                //append element to id root
                $("#"+$container_id+" .blocks").append(element2);
                //add element to proper parent
                var $container_id = addElement('control', data, '', element2);

                return element;

            }
            if (element.closest("div[id]").id === 'frame') {

                var $block_id = addElement('block','drag1', 'frame', element);

                var element2 = document.createElement("div");
                $("#"+$block_id+" .block_area").append(element2);
                var  $container_id = addElement('container', 'drag2', '', element2);

                var element3 = document.createElement("div");
                $("#"+$container_id+" .blocks").append(element3);

                var $container_id = addElement('control', data, '', element3);

                return element;
            }
            if (!element.parentNode.classList.contains("cards") && !element.parentNode.classList.contains("block") && element.parentNode.id != 'frame') {
                element.remove();
            }

        }

        ev.stopPropagation();
        return false;
    }



    //Create templates

    //Depositories

    var block="<div class='block_area panel panel-default panel-body sortable'>" +
        "</div>";

    var container = "<div class='blocks panel panel-default panel-body'>" +
        "<div class='title_card'>" +
        "<div class='right'>" +
        "<span class='glyphicon glyphicon-pencil g-card'></span>" +
        "<span class='glyphicon glyphicon-trash'></span></div>" +
        "</div>"+
        "</div>" +
        "</div>";

    var block_container = "<div class='block_area panel panel-default panel-body sortable'>" +
        "<div class='col-xs-4 column sortable'>" +
        "<div class='blocks panel panel-default panel-body'>" +
        "<div class='title_card'>" +
        "<div class='right'>" +
        "<span class='glyphicon glyphicon-pencil g-card'></span>" +
        "<span class='glyphicon glyphicon-trash'></span></div>" +
        "</div>"+
        "</div>" +
        "</div>" +
        "</div>";

    //Fields&Controls

    var text_box = "<div class='items-fields input-field col s8'>" +
        "<label for='text_box'>Text</label>" +
        "<input  type='text' class='validate' id='text_box'></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var text_area = "<div class='items-fields input-field col s8'>" +
        "<label for='textarea'>Textarea</label>" +
        "<textarea class='materialize-textarea'></textarea></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog text_area'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var html_editor = "<div class='items-fields input-field col s8'>" +
        "<label for='html'>HTML Editor</label>" +
        "<textarea class='materialize-textarea'></textarea></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog html'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var check_box = "<div class='col s8'><form action='#'>" +
        "<p>" +
        "<input type='checkbox' id='test5' />" +
        "<label for='test5'>Red</label>" +
        "</p>" +
        "<p>" +
        "<input type='checkbox' id='test6' />" +
        "<label for='test6'>Yellow</label>" +
        "</p></form></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog check'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var datapicker = "<div class='col s8'><input type='text' class='datepicker'><label>Datepicker</label></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog date'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var dropdown = "<div class='input-field col s8'>" +
        "<select>" +
        "<option value='' disabled selected>Choose your option</option>" +
        "<option value='1'>Option 1</option>" +
        "<option value='2'>Option 2</option>" +
        "<option value='3'>Option 3</option>" +
        "</select>" +
        "<label>Materialize Select</label>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var radiobutton = "<div class='col s8'><form action='#'>" +
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
        "</form></div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog radio'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var lookup = "";
    var grid = "";

    var label = "<div class='items-fields col s8'>" +
        "<label>Label</label>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog label'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var field_number = "<div class='items-fields col s8'>" +
        "<label for='num'>Number</label>" +
        "<input type='number' name='num' min='1' max='5'>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog num'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var field_decimal = "<div class='items-fields col s8'>" +
        "<label for='decimal'>Decimal</label>" +
        "<input type='number' required name='decimal' min='0' value='0' step='.01'>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog decimal></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";

    var group_field = "<div class='items-fields col s8'>" +
        "<label for='text_box'>Text</label>" +
        "<input  type='text' class='validate' id='text_box'>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>" +
        "<div class='items-fields col s8'>" +
        "<label for='textarea'>Textarea</label>" +
        "<textarea class='materialize-textarea'></textarea>" +
        "</div>" +
        "<div class='right col s2'><span class='glyphicon glyphicon-cog text_area'></span>" +
        "<span class='glyphicon glyphicon-remove'></span></div>";


    $('#frame').on('mousedown', '.row', function () {
        var set_blocks = $("#"+ get_block);
        $(".block_area").sortable({
            //axis: "x",
            items: ".column",
            tolerance: 'pointer',
            //cursorAt: { top: 0, left: 0 }
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



        var classname = document.getElementsByClassName("glyphicon-trash");
        var delete_field = document.getElementsByClassName("glyphicon-remove");


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
