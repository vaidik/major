var Dictionary = function() {
    // api end point
    var api = "http://localhost:5000";
    

    // define a word
    var define = function(word, callback) {
        if (word) {
            $.get(api, { q: word }, function (data, textStatus, jqXHR) {
                if (typeof callback == "function") {
                    callback(word, data);
                } else {
                    render(word, data);
                }
            });
        }
    };

    // renders definition in modal
    var render = function(word, data) {
        $('.dictionary-content').html(data);
    }

    // open modal
    var modal = function(word) {
        $('.modal-header .modal-label').html("Dictionary");

        // build body
        var context = {word: "", body: ""};
        if (word) {
            context.word = word;
        }
        var template = Handlebars.compile($("#modal-dictionary").html());
        var source = template(context);
        $('.modal .modal-body').html(source);

        $('.modal').modal('show');

        $('.modal').on('shown', function() {
            $('.modal-body .search').click(function(e) {
                define($('.modal-body input[name=word]').val());
            });
        });
    };

    // launches the modal window and initiates the search
    var find = function(word) {
        modal(word);
        define(word, render);
    }

    var readyContextMenu = function() {
        // add a dummy dictionary DOM element
        $('body').append('<dictionary></dictionary>');

        // register meny with dummy dictionary DOM element
        $.contextMenu({
            selector: "dictionary",
            zIndex: 5000,
            build: function($trigger, e) {
                var selection = window.getSelection().toString();
                if (selection == "") {
                    return false;
                }

                return {
                    items: {
                        foo: {
                            name: "Define \"" + selection + "\"",
                            callback: function(key, opt) {
                                find(window.getSelection().toString());
                            }
                        },
                    },
                };
            },
        });

        /*
        $(document).bind('contextmenu', function(e) {
            var range = window.getSelection().getRangeAt(0).cloneRange().getClientRects();
            if (range.length) {
                if ((e.pageX >= range[0].left && e.pageY <= range[0].right) && (e.pageY >= range[0].top) && (e.pageY <= range[0].bottom )) {
                    $("dictionary").contextMenu({x: e.pageX, y: e.pageY});
                    return false;
                }
            }
        });
        */

    }

    return {
        find: find,
        modal: modal,
        define: define,
        readyContextMenu: readyContextMenu,
    };
};

dictionary = new Dictionary();

/**
 * SAMPLE USAGE
 *
 * dictionary.modal();
 * dictionary.find("word");
 *
 */

$(document).ready(function() {
    dictionary.readyContextMenu();

    $('#dictionary-form').submit(function() {
        var val = $('input[type=text]', this).val();
        if (val != "") {
            dictionary.find(val);
        }
        return false;
    });
});
