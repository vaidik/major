var research = {
    research_objects: {},

    build_list: function () {
        var t = $('#research-list-template').html();
        var source = Handlebars.compile(t);

        var types = ['notes', 'links'];
        var research = [];
        var dump = ds.dump();
        for (var j=0; j<types.length; j++) {
            if (dump[types[j]]) {
                for (r in dump[types[j]]) {
                    var pos = research.push(dump[types[j]][r])-1;
                    research[pos].type = types[j];
                    if (types[j] == 'links') {
                        research[pos].domain = dump[types[j]][r].link.split('://')[1].split('/')[0];
                    }
                }
            }
        }

        research.sort(function(x, y){ return new Date(x.time) < new Date(y.time) });

        $('#research-list').html(source({research: research}));
        $('abbr.timeago').timeago();
    },

    add_modal: function() {
        var modal = $('.modal');
        $('.modal-label', modal).html('Add New Data');

        var modal_content = $('#modal-research-add').html();
        $('.modal-body', modal).html(modal_content);

        $('#research-add ul li a', modal).click(function(e) {
            var action = $(this).attr('data-action');

            $('#research-add', modal).hide();
            $('#research-add-object', modal).removeClass('hidden');
            $('#research-add-' + action, modal).removeClass('hidden');
            $('.modal-label').html('Add New ' + action.toTitleCase());
            $('.modal-footer .removable').append('<button class="btn btn-info save" data-dismiss="modal" aria-hidden="true">Save</button>');

            $('.modal-footer .save').click(function() {
                var $modal_body = $('.modal-body');

                var object = {
                    title: $('input[name=name]', $modal_body).val(),
                    research: $('textarea', $modal_body).val(),
                    tags: $('input[name=tags]', $modal_body).val(),
                };

                if (action == 'note') {
                    var item = 1;
                } else if (action == 'link') {
                    var item = 1;
                    object.link = $('input[name=link]', $modal_body).val();
                }
                if (item) {
                    item = new research[action.toTitleCase()](object);
                    item.save();
                    research.build_list();
                }
            });

            $('.modal').on('hidden', function() {
                $('.modal-footer .removable', this).html('');
            });

            $('input[name=file]').change(function() {
                var $this = $(this)[0];
                $('#file_textbox').val($this.files[0].name);
            });

            var file_textbox = $('#file_textbox');
            var style_to_apply = 'width: ' + (file_textbox.width()-$('#file_button').outerWidth()).toString() + 'px !important; display: inline-block;';
            file_textbox.attr('style', style_to_apply + file_textbox.attr('style'));
        });

        modal.modal('show');
    },
}

Function.prototype.inherit = function(Parent) {
    this.prototype = new Parent();
    return this;
}

var DataStorage = function(dataKey) {
    this.dataKey = dataKey || 'localData';
    this.localData = {};
    this.localObjects = [];

    try {
        var localData = JSON.parse(localStorage.getItem(this.dataKey));
    } catch (e) {
        var localData = null;
    }
    if (localData !== null) {
        this.localData = localData;
    }

    this.push = function(type, key, val) {
        if (!this.localData.hasOwnProperty(type)) {
            this.localData[type] = {};
        }
        this.localData[type][key] = val;
        this.save();
    }

    /*
    this.exists = function(type, ID) {
        try {
            for (var i=0; i<this.localData[type].length; i++) {
                if (this.localData[type][i].ID == ID) {
                    return i;
                }
            }
        } catch(e) {
            console.log('Error occurred', e);
            return -1;
        }

        return -1;
    }
    */

    this.deleteItem = function(ID) {
        var delKey = 0;
        ID = parseInt(ID);

        for (key in this.localData) {
            for (k in this.localData[key]) {
                if (k == ID) {
                    delKey = key;
                }
            }
        }

        if (delKey) {
            delete this.localData[delKey][ID];
        }
    }

    this.delete = function(type, ID) {
        //var i = this.exists(type, ID);
        //if (i != -1) {
        if (this.localData[type][ID]) {
            delete this.localData[type][ID];
            this.save();
            return true;
        }

        return false;
    }

    this.dump = function() {
        return this.localData;
    }

    this.save = function() {
        localStorage.setItem(this.dataKey, JSON.stringify(this.localData));
    }
}

var ds = new DataStorage();

// Generic Item which will be extended for everything possible.
research.Item = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'item';

    this.toString = function() {
        return JSON.stringify(this.object);
    }

    this.delReference = function() {
        if (this._ID) {
            delete ds.localObjects.splice(this._ID, 1);
        } else {
            console.log('missing _ID');
        }
    }

    this.setAttr = function() {
        if (this.$dom) {
            $(this.$dom).attr('data-id', this.ID);
        }
    }

    this.merge = function(obj) {
        for (key in obj) {
            if (typeof obj[key] != "function") {
                this.object[key] = obj[key];
            }
        }
    }

    this.save = function() {
        var exists = 0;
        try {
            exists = ds.localData[this.dataKey][this.ID];
        } catch(e) {;}

        if (!exists) {
            var object = this.object;
            this.object.ID = this.ID;
            ds.push(this.dataKey, this.ID, object);
        } else {
            exists.x = this.object.x;
            exists.y = this.object.y;
        }

        this.object.time = new Date().getTime();
        ds.save();
    };
}

research.Note = function(obj, $dom) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.$dom = $dom;
    this.dataKey = 'notes';
}

research.Note.inherit(research.Item);

research.Link = function(obj) {
    this.object = obj;
    try {
        this.ID = obj.ID || new Date().getTime();
        this.time = obj.time || new Date().getTime();
    } catch(e) {
        this.ID = new Date().getTime();
        this.time = new Date().getTime();
    }

    this.dataKey = 'links';
}

research.Link.inherit(research.Item);

Handlebars.registerHelper('toISOdate', function(date) {
    return new Date(date).toISOString();
});

$(document).ready(function() {
    research.build_list();
    window.setInterval(function() {}, 60000);

    $('#add_research').click(research.add_modal);

    $('#research #research-toolbar select#filter').select2({
    });

    $('#research #research-toolbar select#actions').select2({
    });
});
