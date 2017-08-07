var container = $("#container");
var box = $(".cards");

var width  = 80;
var height = 80;
var rows   = 8;
var cols   = 12;
var snap   = 80;

for (var i = 0; i < rows * cols; i++) {
    var y = Math.floor(i / cols) * height;
    var x = (i * width) % (cols * width);
    $("<div grid-cell></div>").css({ top: y, left: x }).prependTo(container);
}

Draggable.create(box, {
    bounds: container,
    onDrag: onDrag,
});
function onDrag() {

    TweenLite.to(box, 0.5, {
        x: Math.round(this.x / snap) * snap,
        y: Math.round(this.y / snap) * snap,
        ease: Back.easeOut.config(2)
    });
}


$('.cards').droppable({
  drop: function(event, ui) {
    var x = $(this).position().left;
    var y = $(this).position().top;
    TweenLite.to(ui.draggable, 0.5, { left:x, top:y });
  }
});
