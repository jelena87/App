function myFunction() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
function myFunctionTwo() {
    document.getElementById("dropdown-menu-two").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn-two')) {

        var dropdown = document.getElementsByClassName("dropdown-content-two");
        var i;
        for (i = 0; i < dropdown.length; i++) {
            var openDropdowns = dropdown[i];
            if (openDropdowns.classList.contains('show')) {
                openDropdowns.classList.remove('show');
            }
        }
    }
};
function myFunctionThree() {
    document.getElementById("dropdown-menu-three").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn-three')) {

        var dropdown2 = document.getElementsByClassName("dropdown-content-three");
        var i;
        for (i = 0; i < dropdown2.length; i++) {
            var openDropdown2 = dropdown2[i];
            if (openDropdown2.classList.contains('show')) {
                openDropdown2.classList.remove('show');
            }
        }
    }
};

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function removeNode(node) {
    node.parentNode.removeChild(node);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var drag_depo = ['drag1','drag2'];
    var drag_cont = ['text_box','text_area','html_editor','check_box','datapicker','dropdown','radiobutton','lookup','grid','label'];
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

         if(data ==='drag1' && element.parentNode.id ==='frame'){
             element.classList.add("container-fluid","row");
             element.innerHTML ="<div class='block'></div>";
             return element;
         }
         else if(data === 'drag2' && element.parentNode.classList.value === 'block') {
             element.classList.add("cards","col-md-4");
             //element.innerHTML ="<div class='col-md-4 col-xs-12 card'>hey2!</div>";
             // element.draggable();
             return element;
         }
        else if(data === 'drag2' && element.parentNode.id ==='frame') {
            element.classList.add("block");
            element.innerHTML ="<div class='cards col-md-4'></div>";
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
        var text_box = `<div class="input-field col-md-6">
        <label for="text_box">Text</label>
          <input id="text_box" type="text" class="validate">
        </div>`;
        var text_area =`<div class="input-field col-md-6">
        <label for="textarea">Textarea</label>
          <textarea id="textarea" class="textarea"></textarea>
        </div>`;
        var html_editor="";
        var check_box = `<div class="col-md-6">
      <input type="checkbox" id="test" />
      <label for="test">Red</label>
    </div>`;
        var datapicker = `<div class="col-md-6">
          <input type="date" class="datepicker">
        </div>`;
        var dropdown = `<div class="dropdown col-md-6">
    <button class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
    <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">HTML</a></li>
      <li><a href="#">CSS</a></li>
      <li><a href="#">JavaScript</a></li>
    </ul>
  </div>`;
        var radiobutton=`<div class="col-md-6">
      <input name="group" type="radio" id="test" />
      <label for="test">Red</label>
    </div>`;
        var lookup="";
        var grid="";
        var label=`<div class="col-md-6">
        <label>Label</label>
        </div>`;

        var group_field;


        var template;

        //Get dragged element and set template for this element
        switch (data) {
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
        }

        if( element.parentNode.classList.value === 'cards col-md-4'){
            element.classList.add("field");
            element.innerHTML = template;
            return element;

        }
        if(element.parentNode.classList.value === 'block'){
            element.classList.add("cards","col-md-4");
            element.innerHTML ="<div class='field'>"+ template + "</div>";
            return element;

        }
        if(element.parentNode.id ==='frame'){
            element.classList.add("container-fluid","row");
            element.innerHTML ="<div class='block'><div class='cards col-md-4'><div class='field'>" + template +"</div></div></div>";
            return element;
        }
        if(element.parentNode.classList.value !== 'cards col-md-4' && element.parentNode.classList.value !== 'block' && element.parentNode.id != 'frame') {
            element.remove();
        }

    }
    ev.stopPropagation();
    return false;
}

$("#frame").sortable({
    axis: "y",
    items: ".row"
});


$('#frame').on('mousedown','.block',function(){

        $( ".cards" ).draggable({
            containment: "parent"
        });
        $( ".field" ).draggable({
            containment: "parent"
        });
});


// $(".block").sortable({
//
//     connectWith: ".block"
// }).disableSelection();




// $(".block").sortable({
//
//     connectWith: ".block"
// }).disableSelection();
