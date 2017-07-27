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
    var isLeft = 'drag1' === data || "drag2" === data;

    if (isLeft) {

            // Function for create elements in grid
            function BlockHTML(node) {
                var element = document.createElement("div");

                if(node === "block"){
                    element.classList.add("container-fluid","row");
                    element.innerHTML ="<div class='block'></div>";
                    return element;
                }
                if(node === "card") {
                    element.classList.add("cards");
                    element.innerHTML ="<div class='col-md-4 col-xs-12 card'>hey2!</div>";
                    return element;
                }
            }

            var node = document.createElement("DIV");
            ev.target.appendChild(node);

            if(data ==='drag1' && node.parentNode.id ==='frame'){
                node.appendChild(BlockHTML("block"));
            }
            if(data === 'drag2' && node.parentNode.classList.value === 'block'){
                node.appendChild(BlockHTML("card"));
            }
    }
    ev.stopPropagation();
    return false;
}

