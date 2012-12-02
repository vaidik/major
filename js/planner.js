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
        window.setTimeout(function() {
            $('.pin-board').css({ '-webkit-transform-origin': '0 0' });
        }, 1);
        window.setTimeout(function() {
            $('.pin-board').css({ '-webkit-transform-origin': 'left top' });
        }, 210);
    },

    // updates pin board's scale when zoomed in/out
    zoom_slider_update: function(val, fake) {
        $('#zoom_value').html(val + '%');
        var pin_board = $('.pin-board');
        if ($('.item', pin_board).length) {
            pin_board.traggable('changeScale', parseInt(val)/100);
        } else {
            pin_board.css('-webkit-transform', 'scale(' + parseInt(val)/100  + ')');
        }
        pin_board.css({ '-webkit-transform-origin': 'left top' });
        if (fake) {
            console.log('faking')
            window.setTimeout(function() {
                planner.zoom_slider_update(val - 1);
            }, 1);
        }
    },

    ready_toolbar: function() {
        // make the planner toolbar ready for use
        $('.planner-toolbar.tool').on('mousedown', function(e) {
            var new_char = $('.character-holder > .character').clone();
            new_char.removeClass('hidden');

            // add item where the tool is clicked
            $('body').append(new_char);

            new_char.css('top', e.pageY - new_char.height()/2);
            new_char.css('left', e.pageX - new_char.width()/2);

            new_char.draggable();
            new_char
            .on('mouseup', function(e, ui) {
                if (!ui) {
                    var ui = {};
                    ui.offset = $(this).offset();
                }
                if (ui.offset.left > ($(window).width() - $('.right-column').width() - $(this).width()/2)) {
                    
                    $(this).remove();
                }
            })
            .on('dragstop', function(e, ui) {
                if (ui.offset.left > ($(window).width() - $('.right-column').width() - $(this).width()/2)) {
                    $(this).remove();
                }

                var pin_board = $('.pin-board');
                var x = e.pageX, y = e.pageY;
                var offset = pin_board.offset();
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

                pin_board.append(clone);
                window.setTimeout(function() {
                    clone.css('-webkit-transform', 'scale(1)');
                    window.setTimeout(function() {
                        clone.css('-webkit-transition', '');
                    }, 310);
                }, 10);
                $(this).remove();

                function rename(ops) {
                    var $this = $('.item-name', ops.$trigger);
                    if ($this.attr('data-mode') == "view") {
                        var old_name = $this.html();
                        var text_field = '<form><input type="text" class="item-name" name="item-name" value="' + old_name + '"></form>';
                        $this.html(text_field);
                        $('input.item-name', $this).focus();

                        $('.item-name form').ready(function() {
                            $this.submit(function(e) {
                                var new_name = $('input[name=item-name]', $this).val();
                                var this_form = $(e.target);
                                this_form.parent().html(new_name)
                                $this.attr('data-mode', 'view');
                                //alert(this_form.parent().html());
                                return false;

                            });
                        });

                        $this.attr('data-mode', 'edit');
                    } else {
                        ;
                    }
                }

                // Make item name resizable
                $('.item-name', clone).dblclick(function() {
                    console.log(e);
                    if ($(this).attr('data-mode') == "view") {
                        var old_name = $(this).html();
                        var text_field = '<form><input type="text" class="item-name" name="item-name" value="' + old_name + '"></form>';
                        $(this).html(text_field);
                        $('input.item-name', this).focus();

                        $('.item-name form').ready(function() {
                            $(this).submit(function(e) {
                                var new_name = $('input[name=item-name]', this).val();
                                var this_form = $(e.target);
                                this_form.parent().html(new_name)
                                //alert(this_form.parent().html());
                                return false;

                            });
                        });

                        $(this).attr('data-mode', 'edit');
                    } else {
                        ;
                    }
                });

                // add context menu here
                $.contextMenu({
                    selector: '.pin-board .item',
                    items: {
                        edit: {
                            name: "Edit",
                            callback: function() { ; },
                        },
                        rename: {
                            name: "Rename",
                            callback: function(key,ops) {
                                rename(ops);
                            },
                        },
                        "delete": {
                            name: "Delete",
                            callback: function(key, ops) {
                                ops.$trigger.remove();
                            },
                        },
                    },
                });
            });

            $('.pin-board')
                .traggable({
                    containment: "parent",
                })

            new_char.trigger(e);
        });
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

    planner.ready_toolbar();
   
});
