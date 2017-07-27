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
    //var isLeft = 'drag1' == data || "drag2" == data;
    var isLeft = data;
    var nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = "img" + ev.target.id;
    // clean target space if needed
    if (isLeft == 'drag1') {

            function boldHTML() {
                var element = document.createElement("div");
                //element.classList.add("container");
                element.innerHTML ="<div id='block' class='container-fluid block'></div>";
                return element;
            }
            var node = document.createElement("DIV");

            ev.target.appendChild(node);
            if(node.parentNode.id =='frame'){
                node.appendChild(boldHTML());
            }

    }
    if(isLeft == 'drag2') {

            function boldHTML() {
                var element = document.createElement("div");
                //element.classList.add("row");
                element.innerHTML ="<div class='col-md-4 col-xs-12 card'>hey2!</div>";
                return element;
            }
        var node = document.createElement("DIV");

        ev.target.appendChild(node);
        if(node.parentNode.id =='block'){
            node.appendChild(boldHTML());
        }
    }
    // else {
    //     if (ev.target.nodeName != 'IMG') {
    //         removeNode(document.getElementById(data));
    //         ev.target.appendChild(nodeCopy);
    //     }
    // }
    ev.stopPropagation();
    return false;
}
