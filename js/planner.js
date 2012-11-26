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
        if ($('.pin-board .item').length) {
            $('.pin-board').traggable('changeScale', parseInt(val)/100);
        }
        $('.pin-board').css('-webkit-transform', 'scale(' + parseInt(val)/100  + ')');
        val = Math.round((parseInt(val) / 100 - 1)*100)/100;
        $('.pin-board').css({ '-webkit-transform-origin': 'left top' });

        /*
        var i = $('.pin-board .item')[0];
        i.css('top', parseInt(i.css('top'))+1);
        i.css('top', parseInt(i.css('top'))-1);
        */
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
    
    $('.planner-toolbar.tool').on('mousedown', function(e) {
        //var char_html = $('.character-holder').html();
        var new_char = $('.character-holder > .character').clone();
        new_char.css('position', 'absolute');
        new_char.removeClass('hidden');
        new_char.addClass('new-char');
        //new_char.css('top', e.pageY/2);
        //new_char.css('left', e.pageX/2);

        new_char.css('top', e.pageY - new_char.height()/2);
        new_char.css('left', e.pageX - new_char.width()/2);
        $('body').append(new_char);

        new_char.draggable();
        new_char.on('dragstop', function(e) {
            var x = e.pageX, y = e.pageY;
            var offset = $('.pin-board').offset();
            var zoom_val = parseInt($('#zoom_value').html())/100;
            x = x/zoom_val;
            y = y/zoom_val;
            x = x - (offset.left/zoom_val + $(this).width()/2);
            y = y - (offset.top/zoom_val + $(this).height()/2);
            var clone = $(this).clone();
            clone.css('position', 'absolute');
            clone.css({left: x, top: y});
            clone.css('-webkit-transform', 'scale(0.7)');
            clone.css('-webkit-transition', '0.3s all ease-out');
            $('.pin-board').append(clone);
            window.setTimeout(function() {
                clone.css('-webkit-transform', 'scale(1)');
                window.setTimeout(function() {
                    clone.css('-webkit-transition', '');
                }, 310);
            }, 10);
            $(this).remove();
        });

        /*
        $('.pin-board').append(new_char);
        new_char.css('top', parseInt(new_char.css('top'))+1);
        //$('body').append(new_char);
        */
        $('.pin-board')
            .traggable({
                containment: "parent",
            })
            .bind('dragstop', function(e, ui) {
                if (ui.offset.left > ($(window).width() - $('.right-column').width() - $(this).width()/2)) {
                    $(this).remove();
                }
            });
        /**/

        new_char.trigger(e);
    });
    /*
    $('.character').pep({
        constrainToParent: true,
    });
    */

    // board drager
    /*
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
            /
        },
    });
    */
});
