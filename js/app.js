
function myFunction(geeter) {
    var get_id = geeter;
    document.getElementById(get_id).classList.toggle("show");
}


function allowDrop(ev) {
    ev.preventDefault();
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

    // var x = ev.pageX - this.offsetLeft;
    // var y = ev.pageY - this.offsetTop;

    // Create GRID
    var width  = 80;
    var height = 40;
    var rows   = 27;
    var cols   = 12;

    for (var i = 0; i < rows * cols; i++) {
        var y = Math.floor(i / cols) * height;
        var x = (i * width) % (cols * width);
        $("<div grid-cell></div>").css({ top: y, left: x }).prependTo(frame);
    };


    var drag_depo = ['drag1','drag2'];
    var drag_cont = ['text_box','text_area','html_editor','check_box',
        'datapicker','dropdown','radiobutton','lookup','grid','label','field_text','field_area',
        'field_date', 'field_number', 'field_drop_down', 'field_checkbox', 'field_radio_button', 'field_decimal', 'group_field', 'field_html'];
    var isLeft;
    if(drag_depo.includes(data)){
        isLeft = 'depositories';
    }
    if(drag_cont.includes(data)) {
        isLeft = 'controls';
    }


    if (isLeft === 'depositories') {

        //create elements in grid
        var element = document.createElement("div");
        ev.target.appendChild(element);


        var get_frame = element.closest("div[id]").id;

        if(data ==='drag1' && get_frame === 'frame' ){
            block_id = block_id + 1;

            element.classList.add("block_area");
            element.id = block_id;
            element.innerHTML =
             "<div class='block'>" +
             "<div class='title'><span class='block-title'>Block Title</span>" +
             "</div>" +
             "</div>";

            $('#frame').append(element);

            return element;
        }

        else if(data === 'drag2' && element.parentNode.classList.contains("block")) {
            id = id +1;
            get_block = element.closest("div[id]").id;
            element.classList.add("cards");
            var x = ev.pageX - $("#" + get_block).offset().left;
            var y = ev.pageY - $("#" + get_block).offset().top ;
            element.style.transform = 'translate3d('+x+'px, '+y+'px, 0px)';
            //element.style.transform = 'translate3d(80px, 80px, 0px)';
            element.id = id;

            element.innerHTML =
                "<div class='title_card'>" +
                "<div class='right'>" +
                "<span class='glyphicon glyphicon-pencil g-card'></span>" +
                "<span class='glyphicon glyphicon-trash'></span></div>" +
                "</div>" +
                "<div class='card'>" +
                "</div>";

            return element;
        }
        else if(data === 'drag2' && element.closest("div[id]").id ==='frame') {

            id = id +1;
            block_id = block_id + 1;
            get_block = block_id;

            element.classList.add("block_area");
            element.id = block_id;


            element.innerHTML =
                "<div class='block'><div class='title'><span class='block-title'>Block Title</span>" +
                "<div class='cards' id="+ id +">" +
                "<div class='title_card'>" +
                "<div class='right'>" +
                "<span class='glyphicon glyphicon-pencil g-card'></span>" +
                "<span class='glyphicon glyphicon-trash'></span></div>" +
                "</div>" +
                "<div class='card'>" +
                "</div>" +
                "</div></div>";
            $('#frame').append(element);

            return element;
        }
        else {
            element.remove();
        }

    }
    if (isLeft === 'controls'){

        var element = document.createElement("div");
        ev.target.appendChild(element);

        //Create templates


        var text_box = "<div class='items-fields input-field col s8'>" +
            "<label for='text_box'>Text</label>" +
            "<input  type='text' class='validate' id='text_box'></div>" +
            "<div class='right col s2'><span class='glyphicon glyphicon-cog text_box'></span>" +
            "<span class='glyphicon glyphicon-remove'></span></div>";

        var text_area ="<div class='items-fields input-field col s8'>" +
            "<label for='textarea'>Textarea</label>" +
            "<textarea class='materialize-textarea'></textarea></div>" +
            "<div class='right col s2'><span class='glyphicon glyphicon-cog text_area'></span>" +
            "<span class='glyphicon glyphicon-remove'></span></div>";

        var html_editor="<div class='items-fields input-field col s8'>" +
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

        var datapicker =  "<div class='col s8'><input type='text' class='datepicker'><label>Datepicker</label></div>" +
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

        var radiobutton="<div class='col s8'><form action='#'>" +
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

        var lookup="";
        var grid="";

        var label="<div class='items-fields col s8'>" +
            "<label>Label</label>" +
            "</div>" +
            "<div class='right col s2'><span class='glyphicon glyphicon-cog label'></span>" +
            "<span class='glyphicon glyphicon-remove'></span></div>";

        var field_number = "<div class='items-fields col s8'>"+
            "<label for='num'>Number</label>" +
            "<input type='number' name='num' min='1' max='5'>" +
            "</div>" +
            "<div class='right col s2'><span class='glyphicon glyphicon-cog num'></span>" +
            "<span class='glyphicon glyphicon-remove'></span></div>";

        var field_decimal = "<div class='items-fields col s8'>"+
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



        var template;

        //Get dragged element and set template for this element
        switch (data) {
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

        if( element.parentNode.classList.contains("cards")){
            element.classList.add("field");
            element.innerHTML = template;
            return element;

        }
        if(element.parentNode.classList.contains("block")){
            id = id +1;
            element.classList.add("cards");
            element.id = id;
            element.innerHTML ="<div class='title_card'>" +
                "<div class='right'>" +
                "<span class='glyphicon glyphicon-pencil g-card'></span>" +
                "<span class='glyphicon glyphicon-trash'></span></div>" +
                "</div>" +
                "<div class='card'>"+
                "<div class='field'>" + template + "</div></div>";
            return element;

        }
        if(element.parentNode.id ==='frame'){
            id = id + 1;
            block_id = block_id + 1;
            get_block = block_id;
            element.classList.add("block_area");
            element.id = block_id;
            element.innerHTML ="<div class='block'><div class='title'><span class='block-title'>Block Title</span>" +
                "<div class='cards' id="+ id +">" +
                "<div class='title_card'>" +
                "<div class='right'>" +
                "<span class='glyphicon glyphicon-pencil g-card'></span>" +
                "<span class='glyphicon glyphicon-trash'></span></div>" +
                "</div>" +
                "<div class='card'>"+
                "<div class='field'>" + template + "</div></div>"+
                "</div></div></div>";
            return element;
        }
        if(!element.parentNode.classList.contains("cards")  && !element.parentNode.classList.contains("block") && element.parentNode.id != 'frame') {
            element.remove();
        }

    }

    ev.stopPropagation();
    return false;
}


$('#frame').on('mousedown','.block',function(){
    var frame = $("#frame");
    var container = $("#" + get_block);
    var box = $("#" + id);
    // console.log(container);
    var snap   = 40;
    var snapX = 80;


    var droppables = $(".cards");

    var overlapThreshold = 0;
    var pointX = 0;
    var pointY = 0;
    Draggable.create(box, {
        type:"x,y",
        bounds: container,
        //containment: ".block",

        onDrag: onDrag,
        onDragEnd:function(e) {

            var i = droppables.length;


            while (--i > 0) {

                if (this.hitTest(droppables[i], overlapThreshold)) {


                    TweenLite.to(this.target, 0.5, {
                        x: pointX,
                        y: pointY
                    });


                }
                else {
                    //console.log('no overlap');

                }
            }


        }

    });

    function onDrag() {

        pointX = this.startX;
        pointY = this.startY;

        TweenLite.to(box, 0.5, {
            x: Math.round(this.x / snapX) * snapX,
            y: Math.round(this.y / snap) * snap,
            ease: Back.easeOut.config(2)
        });


    }
    // $( "#frame" ).sortable();

// Sortable block
    $('#frame').sortable({
        axis: 'y',
        items: '.block_area'
    });



    /*$(container).each(function() {
     var drag = $(this);
     var handle = $("<div class='resize-handle'></div>").appendTo(drag);
     TweenLite.set(handle, { top: drag.width(), left: drag.height() });



     Draggable.create(handle, {
     //type:"top,left",
     onPress: function(e) {
     e.stopPropagation(); // cancel drag
     },
     onDrag: function(e) {
     TweenLite.set(this.target.parentNode, { width: this.x, height: this.y });
     }
     });
     });
     $(box).each(function() {
     var drag = $(this);
     var handle = $("<div class='resize-box'></div>").appendTo(drag);
     TweenLite.set(handle, { top: drag.width(), left: drag.height() });



     Draggable.create(handle, {
     type:"top,left",
     onPress: function(e) {
     e.stopPropagation(); // cancel drag
     },
     onDrag: function(e) {
     TweenLite.set(this.target.parentNode, { width: this.x, height: this.y });
     }
     });
     });*/



    var classname = document.getElementsByClassName("glyphicon-trash");
    var delete_field = document.getElementsByClassName("glyphicon-remove");


    var myFunction = function() {
        $(this).closest('.cards').remove();
    };
    var deleteField = function () {
        $(this).closest('.field').remove();
    };



    Array.from(classname).forEach(function(element) {
        element.addEventListener('click', myFunction);
    });
    Array.from(delete_field).forEach(function(element) {
        element.addEventListener('click', deleteField);
    });


    $(".g-card").click(function(){
        $(".general").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".text_box").click(function(){
        $(".edit-text").show();
        $(".general, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".text_area").click(function(){
        $(".edit-textarea").show();
        $(".edit-text, .general, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".num").click(function(){
        $(".edit-number").show();
        $(".edit-text, .edit-textarea, .general, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".decimal").click(function(){
        $(".edit-decimal").show();
        $(".edit-text, .edit-textarea, .edit-number, .general, .edit-html, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".html").click(function(){
        $(".edit-html").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .general, .edit-drop, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".check").click(function(){
        $(".edit-checkbox").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .general, .edit-date, .edit-radio").hide();
    });
    $(".drop").click(function(){
        $(".edit-drop").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .general, .edit-checkbox, .edit-date, .edit-radio").hide();
    });
    $(".date").click(function(){
        $(".edit-date").show();
        $(".edit-text, .edit-textarea, .edit-number, .edit-decimal, .edit-html, .edit-drop, .edit-checkbox, .general, .edit-radio").hide();
    });
    $(".radio").click(function(){
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
