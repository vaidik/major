$(document).ready(function() {
    $("#workspace-toggle a").on("click", function() {
        main.toggle_workspace($(this).html());
    });

    $('#w-toggle').toggleButtons({
        width: 200,
        label: {
            enabled: "Editor",
            disabled: "Planner"
        },
        style: {
            enabled: "primary",
            disabled: "primary"
        },
        onChange: function($el, status, e) {
            if (main.workspace_current == "planner") {
                main.workspace_current = "editor";
            } else {
                main.workspace_current = "planner";
            }
            main.toggle_workspace(main.workspace_current);
        },
    });
});

$('#editor').load(function() {
    $(this).hide();
});

var main = {
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
            toggle_workspace_link();
        } else if (current == "planner") {
            $('#planner').show();
            toggle_workspace_link();
        } else if (current == "research") {
            $('#research').show();
            toggle_workspace_link();
        }
    },
};
