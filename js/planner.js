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
        var mousedown_callback = function(e) {
            var new_char = $('.character-holder > .character').clone();
            var text = $(this).text().toLowerCase();

            $('.item-icon', new_char).css(tools_css[text]);
            new_char.attr('data-tool', text);
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

                var text = $(this).attr('data-tool');
                console.log(text);
                if (text == 'theme') {
                    var char = new Theme(x, y);
                } else if (text == 'character') {
                    var char = new Character(x, y);
                } else if (text == 'setting') {
                    var char = new Setting(x, y);
                } else if (text == 'scene') {
                    var char = new Scene(x, y);
                } else if (text == 'object') {
                    var char = new Obj(x, y);
                } else if (text == 'plot') {
                    var char = new Plot(x, y);
                }
                $(this).remove();
            });

            $('.pin-board')
                .traggable({
                    containment: "parent",
                })

            new_char.trigger(e);
        };

        $('.planner-toolbar.tool.draggable').on('mousedown', mousedown_callback);
    },
}

var Tool = function(x, y) {
    this.init = function(x, y) {
        var pin_board = $('.pin-board');
        var clone = $('.character-holder > .character').clone();
        $('.item-name', clone).text('New ' + this.label);
        clone.removeClass('hidden');

        clone.css('position', 'absolute');
        clone.css({left: x, top: y});
        clone.css('-webkit-transform', 'scale(0.7)');
        clone.css('-webkit-transition', '0.3s all ease-out');
        //$('.item-icon', clone).css({'background': 'url(' + this.background_image + '?qeq=qwe) no-repeat',
        //                            'background-position': this.background_pos,
        //                            'background-size': this.background_size});
        console.log(this.css);
        $('.item-icon', clone).css(this.css);
        a = $('.item-icon', clone);

        pin_board.append(clone);
        window.setTimeout(function() {
            clone.css('-webkit-transform', 'scale(1)');
            window.setTimeout(function() {
                clone.css('-webkit-transition', '');
            }, 310);
        }, 10);
    }


    this.prepareMenu = function() {
        var rename = function(ops) {
            var $this = $('.item-name', ops.$trigger);
            if ($this.attr('data-mode') == "view") {
                var old_name = $this.html();
                var text_field = '<form><input type="text" class="item-name" name="item-name" value="' + old_name + '"></form>';
                $this.html(text_field);
                $('input.item-name', $this).focus();

                $('.item-name form').ready(function() {
                    $this.submit(function(e) {
                        // convert this into a function
                        var new_name = $('input[name=item-name]', $this).val();
                        var this_form = $(e.target);
                        this_form.parent().html(new_name)
                        $this.attr('data-mode', 'view');
                        return false;
                    });
                });

                $this.attr('data-mode', 'edit');
            } else {
                ;
            }
        }

        $.contextMenu('destroy');
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
    }

    //this.init(x, y);
    this.prepareMenu();
}

var tools_css = {
    character: {
        background: 'url(../img/tools/characters.png) no-repeat',
        'background-position': '100% 100%',
        'background-size': '400%',
    },
    theme: {
        background: 'url(../img/tools/theme.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    setting: {
        background: 'url(../img/tools/setting.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    scene: {
        background: 'url(../img/tools/scene.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    object: {
        background: 'url(../img/tools/object.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    plot: {
        background: 'url(../img/tools/plot.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
};

var Character = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/characters.png';
    this.background_pos = '100% 100%';
    this.background_size = '400%';
    this.label = 'Character';
    this.css = tools_css.character;
    this.init(x, y);
}

var Theme = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/theme.png';
    this.background_pos = '0px 0px';
    this.background_size = '100%';
    this.label = 'Theme';
    this.css = tools_css.theme;
    this.init(x,y);
}

var Setting = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/setting.png';
    this.background_pos = '0px 0px';
    this.background_size = '100%';
    this.label = 'Setting';
    this.css = tools_css.setting;
    this.init(x,y);
}

var Scene = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/scene.png';
    this.background_pos = '0px 0px';
    this.background_size = '90%';
    this.label = 'Scene';
    this.css = tools_css.scene;
    this.init(x,y);
}

var Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/object.png';
    this.background_pos = '0px 0px';
    this.background_size = '90%';
    this.label = 'Object';
    this.css = tools_css.object;
    this.init(x,y);
}

var Plot = function(x, y) {
    this.x = x;
    this.y = y;
    this.background_image = '../img/tools/plot.png';
    this.background_pos = '0px 0px';
    this.background_size = '90%';
    this.label = 'Plot';
    this.css = tools_css.plot;
    this.init(x,y);
}

Character.inherit(Tool);
Theme.inherit(Tool);
Setting.inherit(Tool);
Scene.inherit(Tool);
Obj.inherit(Tool);
Plot.inherit(Tool);

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
