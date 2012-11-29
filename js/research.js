var research = {
    
}

$(document).ready(function() {
    var t = $('#research-list-template').html();
    var source = Handlebars.compile(t);
    $('#research-list').html(source({}));

    var html = $('#research-list > ul').html();
    for (var i=0;i<8;i++) {
        $('#research-list > ul').append(html);
    }

    $('#research #research-toolbar select#filter').select2({
    });

    $('#research #research-toolbar select#actions').select2({
    });
});
