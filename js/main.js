$(document).ready(function() {
    $("#workspace-toggle a").on("click", function() {
        main.toggle_workspace($(this).html());
    });

    $('#w-toggle').toggleButtons({
        width: 208,
        label: {
            enabled: "Editor",
            disabled: "Planner"
        },
        style: {
            enabled: "info",
            disabled: "info"
        },
        onChange: function($el, status, e) {
            if (main.workspace_current == "planner") {
                editor.wysiwyg_init();
                main.workspace_current = "editor";
            } else {
                main.workspace_current = "planner";
                var $form = $('#editor-form');
                $('> span', $form).remove();
                $('> textarea', $form).show();
            }
            main.toggle_workspace(main.workspace_current);
        },
    });

    $('.modal').on('hidden', function() {
        $('.modal-label', this).html('');
        $('.modal-body', this).html('');
        $('.modal-footer .removable', this).html('');
    });
});

$('#editor').load(function() {
    $(this).hide();
});

var main = {
    // All data objects are stored in this
    localData: {},

    workspace_current: "planner",
    toggle_workspace: function(current) {
        current = current.toLowerCase();

        function toggle_workspace_link() {
            $('#workspace-toggle a').each(function() {
                if ($(this).text().toLowerCase() == current) {
                    $(this).css('font-weight', 'bold');
                } else {
                    $(this).css('font-weight', '');
                }
            });
        }

        $('.workspace-holder').hide();
        if (current == "editor") {
            $('#editor').show();
            $('#editor-toolbar').show();
            $('#planner-toolbar').hide();
            toggle_workspace_link();
        } else if (current == "planner") {
            $('#planner').show();
            $('#editor-toolbar').hide();
            $('#planner-toolbar').show();
            toggle_workspace_link();
        } else if (current == "research") {
            $('#research').show();
            toggle_workspace_link();
        }
    },
};

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
