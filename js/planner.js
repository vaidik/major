var planner = {
    adjust_board: function() {
        $('.board').css('height', $(window).height() - $('.top-row').outerHeight() - $('.scene-manager').height());
    },

    adjust_scene_manager: function() {
        $('.timeline-objects').width($('.timeline').width() - (75 + 40));
        $('.trow').width(900);
    },

    toggle_scene_manager: function() {
        var scene_toolbar = $('.scene-toolbar');

        if (scene_toolbar.css('display') != "none") {
            var toolbar_height =  scene_toolbar.height();
            $('.scene-manager').css('height', $('.scene-manager').height() - toolbar_height);
            $('.board').css('height', $('.board').height() + toolbar_height);

            scene_toolbar.hide();
        } else {
            var toolbar_height =  scene_toolbar.height();
            $('.scene-manager').css('height', $('.scene-manager').height() + toolbar_height);
            $('.board').css('height', $('.board').height() - toolbar_height);
            
            scene_toolbar.show();
        }
        layout.adjust_columns();
    },

    zoom_slider_update: function(val) {
        $('#zoom_value').html(val + '%');
    },
}

$(document).ready(function() {
    // adjust board
    planner.adjust_board();
    planner.adjust_scene_manager();

    $(window).resize(function() {
        planner.adjust_board();
        planner.adjust_scene_manager();
    });

    // toggle handler
    $('.toggle-horizontal').click(planner.toggle_scene_manager);

    // board drager
    var pin_board = $('.pin-board');
    pin_board.draggable({
        drag: function() {
            var pin_board = $('.pin-board');
            var pin_board_offset = pin_board.offset();
            /*
            if (($('.pin-board').width() + pin_board_offset.left - $('.board').width()) <= 0) {
                $(document).trigger("mouseup");
            }
            if (pin_board_offset.left >= 0) {
                $(document).trigger("mouseup");
            }
            */
        },
    });


});
