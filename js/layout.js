var layout = {
    adjust_columns: function() {
        // adjust height of .right-column
        $('.right-column').css('height', $(window).height() - $('.top-row').outerHeight());

        // adjust the width of .workspace
        $('.workspace').css('width', $(window).width() - $('.right-column').width());
    },
};

$(document).ready(function() {
    // adjust layout columns
    layout.adjust_columns();

    $(window).resize(function() {
        layout.adjust_columns();
    });
});
