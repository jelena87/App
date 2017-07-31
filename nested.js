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
    var drag_cont = ['text_box'];
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
             element.innerHTML =`<div class='block'><div class="grid-stack-item-content">

                     <div class="grid-stack">
                         <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">1</div></div>
                         <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">2</div></div>
                         <div class="grid-stack-item" data-gs-x="8" data-gs-y="0" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">3</div></div>
                         <div class="grid-stack-item" data-gs-x="0" data-gs-y="1" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">4</div></div>

                         <div class="grid-stack-item" data-gs-x="4" data-gs-y="1" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">5</div></div>
                         <div class="grid-stack-item" data-gs-x="8" data-gs-y="1" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">6</div></div>
                         <div class="grid-stack-item" data-gs-x="0" data-gs-y="2" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">7</div></div>
                         <div class="grid-stack-item" data-gs-x="4" data-gs-y="2" data-gs-width="4" data-gs-height="1"><div class="grid-stack-item-content">8</div></div>
                     </div>

             </div></div>`;
             return element;
         }
         if(data === 'drag2' && element.parentNode.classList.value === 'block') {
             element.classList.add("cards","col-md-4");
             element.innerHTML ="<div class='col-md-4 col-xs-12 card'>hey2!</div>";
             return element;
         }
        if(data === 'drag2' && element.parentNode.id ==='frame') {
            element.classList.add("block");
            element.innerHTML ="<div class='cards col-md-4'></div>";
            return element;
        }

    }
    if (isLeft === 'controls'){

        var element = document.createElement("div");
        ev.target.appendChild(element);

        if(data === 'text_box' && element.parentNode.classList.value === 'cards col-md-4'){
            element.classList.add("field");
            element.innerHTML ="<input type='text'>";
            return element;

        }
        if(data === 'text_box' && element.parentNode.classList.value === 'block'){
            element.classList.add("cards","col-md-4");
            element.innerHTML ="<div class='field'><input type='text'></div>";
            return element;

        }
        if(data === 'text_box' && element.parentNode.id ==='frame'){
            element.classList.add("container-fluid","row");
            element.innerHTML ="<div class='block'><div class='cards col-md-4'><div class='field'><input type='text'></div></div></div>";
            return element;
        }

    }
    ev.stopPropagation();
    return false;
}
$('#frame').on('mousedown','.block',function(){

        $( ".cards" ).draggable({
            containment: "parent"
        });
        $( ".field" ).draggable({
            containment: "parent"
        });
});
