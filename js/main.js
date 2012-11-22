$(document).ready(function() {
    $("#workspace-toggle a").on("click", function() {
        main.toggle_workspace($(this).html().toLowerCase());
    });
});

$('#editor').load(function() {
    $(this).hide();
});

var main = {
    toggle_workspace: function(current) {
        if (current == "editor") {
            $('.planner').hide();
            $('#editor').show();
        } else if (current == "planner") {
            $('#editor').hide();
            $('.planner').show();
        }
    },
};
