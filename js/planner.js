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

    show_only: function(tool) {
        $('.pin-board .item').hide();
        if (tool) {
            $('.pin-board .item.' + tool).show();
        } else {
            planner.show_all();
        }
    },

    show_all: function() {
        $('.pin-board .item').show();
    },

    ready_toolbar: function() {
        // make the planner toolbar ready for use
        var mousedown_callback = function(e) {
            var new_char = $('.character-holder > .character').clone();
            var text = $(this).text().toLowerCase();

            $('.item-icon', new_char).css(tools_css[text]);
            $('.item-name', new_char).html('New ' + text.toTitleCase());
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
                var offset = {};
                offset.x = x;
                offset.y = y;
                if (text == 'theme') {
                    var char = new planner.Theme(offset);
                } else if (text == 'character') {
                    var char = new planner.Character(offset);
                } else if (text == 'setting') {
                    var char = new planner.Setting(offset);
                } else if (text == 'scene') {
                    var char = new planner.Scene(offset);
                } else if (text == 'object') {
                    var char = new planner.Obj(offset);
                } else if (text == 'plot') {
                    var char = new planner.Plot(offset);
                }
                char.update({}, true, 'create');
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

var Tool = function(object) {
    this.dataKey = 'tool';

    this.init = function(x, y) {
        if (this.object.created || this.object.old) {
            var $dom = $('[data-id=' + this.object.ID + ']');
            this.object.x = $dom.css('left');
            this.object.y = $dom.css('top');
            this.$dom = $dom;

            delete this.object.created;
            delete this.object.old;
            return;
        }

        var pin_board = $('.pin-board');
        this.$dom = $('.character-holder > .character').clone();
        var clone = this.$dom;
        $('.item-name', clone).text(this.object.data.name);
        clone.removeClass('hidden');
        clone.addClass(this.dataKey);

        clone.css('position', 'absolute');
        clone.css({left: x, top: y});
        clone.css('-webkit-transform', 'scale(0.7)');
        clone.css('-webkit-transition', '0.3s all ease-out');
        clone.attr('data-id', this.ID);
        $('.item-icon', clone).css(this.css);
        a = $('.item-icon', clone);

        pin_board.append(clone);
        window.setTimeout(function() {
            clone.css('-webkit-transform', 'scale(1)');
            window.setTimeout(function() {
                clone.css('-webkit-transition', '');
            }, 310);
        }, 10);

        this.prepareMenu();

        clone.bind('dblclick', this.modal);
    }

    this.update = function(object, notify, e) {
        if (!object) {
            return;
        }

        //this.merge(object);
        console.log(object);
        for (key in object) {
            this.object.data[key] = object[key];
            console.log(key);
        }
        this.object.x = this.$dom.css('left');
        this.object.y = this.$dom.css('top');
        this.save();

        var emit_object = $.extend({}, this.object);
        emit_object.dataKey = this.dataKey;

        if (notify) {
            if (!e) {
                var e = 'create';
            }
            try { 
                tools.emit(e, emit_object);
            } catch (e) {
                console.log('Not connected to WebSockets Server.');
            };
            delete this.old;
        }
    }

    this.prepareMenu = function() {
        var label = this.label;
        var update = this.update;

        var modal = function(e, ops) {
            if (typeof e == "object") {
                var _ID = parseInt($(this).attr('data-id'));
            } else {
                var _ID = parseInt($(ops.$trigger).attr('data-id'));
            }


            var modal = $('.modal');
            var label = $(this).clone().removeClass('character').removeClass('item').attr('class').toLowerCase();
            label = label.substr(0, label.length-1);
            var body = $('#tool-modal-' + label.toLowerCase()).html();
            $('.modal-label', modal).html('New ' + label.toTitleCase());
            $('.modal-body', modal).html(body);
            $('.modal-footer .removable').append('<button class="btn btn-info save" data-dismiss="modal" aria-hidden="true">Save</button>');
            modal.modal('show');

            var data = ds.getItem(_ID);
            for (key in data.object.data) {
                $('.modal-body form [name=' + key + ']').val(data.object.data[key]);
                console.log($('.modal-body form [name=' + key + ']'));
                console.log(data.object.data[key], '.modal-body form [name=' + key + ']');
            }

            $('.modal-footer .save', modal).click({_ID: _ID}, function(e) {
                var $modal_body = $('.modal-body');

                var form_array = $('form', $modal_body).serializeArray();
                var form_obj = {};
                for (var i=0; i<form_array.length; i++) {
                    form_obj[form_array[i].name] = form_array[i].value;
                }

                console.log(form_obj);
                var clicked_obj = ds.getItem(_ID);
                clicked_obj.update(form_obj, true, 'update');
            });
        }
        this.modal = modal;

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
                        
                        var item = ds.getItem($this.parent().attr('data-id'));
                        item.object.data.name = new_name;
                        item.update({});
                        ds.save();

                        var emit_object = $.extend({}, item.object);
                        emit_object.dataKey = item.dataKey;

                        try {
                            tools.emit('update', emit_object);
                        } catch (e) {
                            console.log('Not connected to WebSockets Server.');
                        }

                        return false;
                    });
                });

                $this.attr('data-mode', 'edit');
            } else {
                ;
            }
        }

        $.contextMenu({
            selector: '.pin-board .item',
            position: function($menu, x, y){ $menu.$menu.css({top: y+2, left: x+2});},
            items: {
                edit: {
                    name: "Edit",
                    callback: modal,
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
                        var ID = ops.$trigger.attr('data-id');
                        ops.$trigger.remove();
                        ds.deleteItem(ID);
                        ds.save();
                        try {
                            tools.emit('remove', {'ID': ID});
                        } catch (e) {
                            console.log('Not connected to WebSockets Server.');
                        };
                    },
                },
            },
        });
    }

    //this.init(x, y);
    //this.prepareMenu();
}

Tool.inherit(research.Item);

var tools_css = {
    character: {
        background: 'url(img/tools/characters.png) no-repeat',
        'background-position': '100% 100%',
        'background-size': '400%',
    },
    theme: {
        background: 'url(img/tools/theme.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    setting: {
        background: 'url(img/tools/setting.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    scene: {
        background: 'url(img/tools/scene.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    object: {
        background: 'url(img/tools/object.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
    plot: {
        background: 'url(img/tools/plot.png) no-repeat',
        'background-position': 'center',
        'background-size': '90%',
    },
};

planner.Character = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'characters';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Character';
    this.css = tools_css.character;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Theme = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'themes';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Theme';
    this.css = tools_css.theme;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Setting = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'settings';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Setting';
    this.css = tools_css.setting;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Scene = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'scenes';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Scene';
    this.css = tools_css.scene;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Obj = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'objects';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Object';
    this.css = tools_css.object;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Plot = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'plots';

    this.x = obj.x;
    this.y = obj.y;
    this.label = 'Plot';
    this.css = tools_css.plot;

    if (!this.object.data) {
        this.object.data = { name: 'New ' + this.label };
    }

    this.init(this.x, this.y);
}

planner.Character.inherit(Tool);
planner.Theme.inherit(Tool);
planner.Setting.inherit(Tool);
planner.Scene.inherit(Tool);
planner.Obj.inherit(Tool);
planner.Plot.inherit(Tool);

$(document).ready(function() {
    planner.toggle_scene_manager();
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
   
    var dump = ds.dump();
    var tools = {
        'characters': 'Character',
        'themes': 'Theme',
        'plots': 'Plot',
        'settings': 'Setting',
        'objects': 'Obj',
        'scenes': 'Scene',
    };
    for (t in tools) {
        for (r in dump[t]) {
            try {
                c = new planner[tools[t]](dump[t][r]);
                c.update({});
            } catch (e) {
                ;
            }
        }
    }
    $('.pin-board')
        .traggable({
            containment: "parent",
        })

    $('.item').mouseup(function() {
        var $this = $(this);
        var id = $this.attr('data-id');
        var dump = ds.dump();

        var a = ds.getItem(id);
        a.update({});

    });
});
