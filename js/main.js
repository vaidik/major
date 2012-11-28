$(document).ready(function() {
    $("#workspace-toggle a").on("click", function() {
        main.toggle_workspace($(this).html().toLowerCase());
    });

    main.modal('#workspace-toggle a', {
        template : '<p>asometha aks daksd asd ad <br><br>djasbd djwbeqwjhe</p>'
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
        $('#workspace-toggle a').each(function() {
            if ($(this).css('font-weight') == 'bold') {
                $(this).css('font-weight', '');
            } else {
                $(this).css('font-weight', 'bold');
            }
        });
    },

    modal: function(selector, options) {
    },
};
