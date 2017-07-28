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
            var openDropdowns = dropdowns[i];
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
    var isLeft = 'drag1' === data || "drag2" === data;

    if (isLeft) {

        //create elements in grid
        var element = document.createElement("div");
        ev.target.appendChild(element);

         if(data ==='drag1' && element.parentNode.id ==='frame'){
             element.classList.add("container-fluid","row");
             element.innerHTML ="<div class='block'></div>";
             return element;
         }
         if(data === 'drag2' && element.parentNode.classList.value === 'block') {
             element.classList.add("cards");
             element.innerHTML ="<div class='col-md-4 col-xs-12 card'>hey2!</div>";
             return element;
         }
    }
    ev.stopPropagation();
    return false;
}
