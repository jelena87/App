$(".row").sortable({
    axis: "x",
    items: ".column"
});
$(".container").sortable({
    axis: "y",
    items: ".row",
    placeholder: 'block-placeholder',
    revert: 150,
    start: function(e, ui) {

        placeholderHeight = ui.item.outerHeight();
        ui.placeholder.height(placeholderHeight + 15);
        $('<div class="block-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

    },
    change: function(event, ui) {

        ui.placeholder.stop().height(0).animate({
            height: ui.item.outerHeight() + 15
        }, 300);

        placeholderAnimatorHeight = parseInt($(".block-placeholder-animator").attr("data-height"));

        $(".block-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
            height: 0
        }, 300, function() {
            $(this).remove();
            placeholderHeight = ui.item.outerHeight();
            $('<div class="block-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
        });

    },
    stop: function(e, ui) {

        $(".block-placeholder-animator").remove();

    }
});

// Block Controls
$(".blocks").sortable({
    connectWith: '.blocks',
    placeholder: 'block-placeholder',
    revert: 150,
    start: function(e, ui) {

        placeholderHeight = ui.item.outerHeight();
        ui.placeholder.height(placeholderHeight + 15);
        $('<div class="block-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);

    },
    change: function(event, ui) {

        ui.placeholder.stop().height(0).animate({
            height: ui.item.outerHeight() + 15
        }, 300);

        placeholderAnimatorHeight = parseInt($(".block-placeholder-animator").attr("data-height"));

        $(".block-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
            height: 0
        }, 300, function() {
            $(this).remove();
            placeholderHeight = ui.item.outerHeight();
            $('<div class="block-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
        });

    },
    stop: function(e, ui) {

        $(".block-placeholder-animator").remove();

    }
});

