var research = {
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
            $('.modal-footer .removable').append('<button class="btn btn-info" data-dismiss="modal" aria-hidden="true">Save</button>');

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

    // note  object
    note: function() {
        function save() {
        }
    },
}

$(document).ready(function() {
    var t = $('#research-list-template').html();
    var source = Handlebars.compile(t);
    $('#research-list').html(source({}));

    var html = $('#research-list > ul').html();
    for (var i=0;i<8;i++) {
        $('#research-list > ul').append(html);
    }

    $('#add_research').click(research.add_modal);

    $('#research #research-toolbar select#filter').select2({
    });

    $('#research #research-toolbar select#actions').select2({
    });

    main.toggle_workspace("research");
});
