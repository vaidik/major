var editor = {
    // holds the setInterval object
    tinymce_update_interval: '',
    last_saved_update_interval: '',
    last_saved: new Date(),

    options: "",

    autosave: function() {
        // send an ajax request to store at the backi
        this.last_saved = new Date();
    },

    wysiwyg_init: function() {
        var tools = {
            'characters': 'Character',
            'themes': 'Theme',
            'plots': 'Plot',
            'settings': 'Setting',
            'objects': 'Obj',
            'scenes': 'Scene',
        }; 

        var dump = ds.dump();
        var options = [];
        for (k in tools) {
            for (key in dump[k]) {
                options.push(dump[k][key].data.name);
            }
        }

        editor.options = options.join();

        tinyMCE.init({
            mode : "textareas",
            language: false,
            theme : "advanced",
            plugins : "autocomplete",
            theme_advanced_buttons1 : "bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright,justifyfull,bullist,numlist,undo,redo,link,unlink,mybutton",
            theme_advanced_buttons2 : "",
            theme_advanced_buttons3 : "",
            theme_advanced_buttons3_add : "",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "",

            autocomplete_options: editor.options,
        });

        // add a saving status label
        $('<div style="position: absolute;left: 400px;top: 10px;" id="saved-status"></div>').insertAfter('#editor-form textarea');

        this.tinymce_update_interval = window.setInterval(function() {
            $("#editor-form textarea").val(tinyMCE.activeEditor.getContent())
        }, 2000);

        this.last_saved_update_interval = window.setInterval(function() {
            var status = $('#editor-form #saved-status');
            status.html('Last saved: <abbr>' + $.timeago(editor.last_saved) + '</abbr>');
        }, 3000);
    },
};

$(document).ready(function() {
    // Add autosave functionality
    $('#editor-form').sisyphus({
        timeout: 5,
        autoRelease: true,
        onSave: function() {
            editor.autosave();
        },
        onBeforeRestore: function() {
        },
        onRestore: function() {
        },
        onRelease: function() {},
    });

    $('#add-chapter').click(function() {
        $('#chapter-list').append('<li>New Chapter</li>');
    });
});
