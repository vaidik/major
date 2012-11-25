var layout = {
    adjust_columns: function() {
        // adjust height of .right-column
        var columns_height = $(window).height() - $('.top-row').outerHeight();
        $('.right-column').css('height', columns_height);
        $('.workspace').css('height', columns_height);

        // adjust height of .toggle-vertical
        $('.toggle-holder').css('height', $('.right-column').height());

        // adjust the width of .workspace
        $('.workspace').css('width', $(window).width() - $('.right-column').width());
    },

    toggle_toolbar: function() {
        var toolbar = $('.toolbar');
        var right_column = $('.right-column');

        if (toolbar.hasClass('toggle-off') === false) {
            right_column.css('overflow-y', 'visible');
            var toolbar_width = toolbar.width();
            $('.workspace').css('width', $('.workspace').width() + toolbar_width);
            right_column.css('width', '12');
            toolbar.addClass('toggle-off');
            toolbar.removeClass('toggle-on');
            toolbar.attr('data-width', toolbar_width);
            $('> div', toolbar).hide();

        } else {
            right_column.css('overflow-y', 'scroll');
            right_column.css('width', '');
            $('.workspace').css('width', $('.workspace').width() - toolbar.attr('data-width'));
            toolbar.addClass('toggle-on');
            toolbar.removeClass('toggle-off');
            $('> div', toolbar).show();

        }

        layout.adjust_columns();
        planner.adjust_scene_manager();
    },
};

$(document).ready(function() {
    // adjust layout columns
    layout.adjust_columns();

    $(window).resize(function() {
        layout.adjust_columns();
    });

    // toggle handler
    $('.toggle-vertical').click(layout.toggle_toolbar);
});
