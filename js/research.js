var research = {
    research_objects: {},

    build_list: function () {
        var t = $('#research-list-template').html();
        var source = Handlebars.compile(t);

        var types = ['notes', 'links'];
        var research_data = [];
        var dump = ds.dump();
        for (var j=0; j<types.length; j++) {
            if (dump[types[j]]) {
                for (r in dump[types[j]]) {
                    var pos = research_data.push(dump[types[j]][r])-1;
                    research_data[pos].type = types[j];
                    if (types[j] == 'links') {
                        research_data[pos].domain = dump[types[j]][r].link.split('://')[1].split('/')[0];
                    }
                    research_data[pos].type = types[j];
                }
            }
        }

        research_data.sort(function(x, y){ return new Date(x.ID) < new Date(y.ID) });

        $('#research-list').html(source({research: research_data}));

        function edit_research(element) {
            var modal = $('.modal');

            var $li = $(element);
            $(element).parents().each(function(index) {
                if ($(this).attr('data-id')) {
                    $li = $(this);
                }
            });

            var ID = $li.attr('data-id');
            var action = $li.clone().removeClass('clip').attr('class');
            action = action.substr(0, action.length - 1);

            var obj = ds.getResearchItem(ID);

            var modal_content = $('#modal-research-add').html();
            $('.modal-body', modal).html(modal_content);

            $('#research-add', modal).hide();

            $('#research-add-object', modal).removeClass('hidden');
            $('#research-add-' + action, modal).removeClass('hidden');
            $('.modal-label').html('Edit ' + action.toTitleCase());
            $('.modal-footer .removable')
                .html('')
                .append('<button class="btn btn-info save" data-dismiss="modal" aria-hidden="true">Save</button>');

            var $form = $('form', modal);
            $('[name=name]', $form).val(obj.object.title);
            $('[name=note]', $form).val(obj.object.research);
            if (obj.object.link) {
                $('[name=link]', $form).val(obj.object.link);
            }
            $('[name=tags]', $form).val(obj.object.tags);

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

                for (k in object) {
                    obj.object[k] = object[k];
                };
                obj.save();
                console.log(research);
                research.build_list();

            });

            modal.modal('show');
        }

        $('#clip-list > li.notes').click(function() {
            edit_research(this);
        });

        $('abbr.timeago').timeago();

        $('[rel=tooltip]').tipsy({fade: true});

        $('#clip-list .destroy').click(function(e) {
            var $li = $(this).parent().parent().parent();
            var ID = $li.attr('data-id');

            var obj = ds.deleteItem(ID);
            ds.save();
            research.build_list();
        });

        $('#clip-list .reader').click(function(e) {
            var $li = $(this).parent().parent().parent();
            var ID = $li.attr('data-id');

            var obj = ds.getResearchItem(ID);
            console.log(obj);
            var url = obj.object.link;

            var link_content = localStorage.getItem(url);
            $('.modal-label').html('Reader: ' + url);
            //$('.modal-body').html(link_content);
            $('.modal').modal('show');
        });

        $('#clip-list .edit').click(function(e) {
            edit_research(this);
        });
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

            if ($('[name=link]', modal).length) {
                $('[name=link]', modal).on('blur', function(e) {
                    var url = $(this).val();
                    if (url == "") { return; }

                    $('[name=name]')
                        .attr('disabled', 'disabled')
                        .val('Trying to fetch title of the URL...');
                    $.get('http://localhost:5000/get_link_data', {url: url}, function(data) {
                        data = JSON.parse(data);
                        if (data.title) {
                            $('[name=name]', modal).val(data.title);
                        }
                        $('[name=name]')
                            .attr('disabled', false);

                        localStorage.setItem(url, data.body);
                    })
                    .error(function() {
                        $('[name=name]')
                            .attr('disabled', false)
                            .val('')
                            .after('<div style="color: red; margin-top: -5px; margin-bottom: 5px; position: relative;">Unable to fetch the page\'s title.</div>');
                    });
                });
            }

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

    this.getItem = function(ID) {
        var dump = this.localData;
        var id = parseInt(ID);

        for (k in dump) {
            for (j in dump[k]) {
                if (dump[k][j].ID == id) {
                    var obj = dump[k][j];

                    var key = k.toTitleCase().substr(0, k.length-1);
                    if (k == 'objects') {
                        key = 'Obj';
                    }
                    obj.created = true;
                    var a = new planner[key](obj);
                    delete a.created;
                }
            }
        }

        if (a) {
            return a;
        }
    };

    this.getResearchItem = function(ID) {
        var dump = this.localData;
        var id = parseInt(ID);

        for (k in dump) {
            for (j in dump[k]) {
                if (dump[k][j].ID == id) {
                    var obj = dump[k][j];

                    var key = k.toTitleCase().substr(0, k.length-1);
                    obj.created = true;
                    var a = new research[key](obj);
                    delete a.created;
                }
            }
        }

        if (a) {
            return a;
        }
    };

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
            try {
                exists.x = this.object.x;
                exists.y = this.object.y;
            } catch (e) {
                ;
            }
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

    $('#add_research').click(research.add_modal);

    $('#research #research-toolbar select#filter').select2({
    });

    $('#research #research-toolbar select#actions').select2({
    });

    $('select#filter').change(function(e) {
        var val = $(this).val();
        $('#clip-list li').hide();
        if (val == "all") {
            $('#clip-list li').show();
        } else {
            $('#clip-list li.' + val).show();
        }
    });
});
