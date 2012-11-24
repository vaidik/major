$(document).ready(function() {
    tinyMCE.init({
        mode : "textareas",
        language: false,
        theme : "advanced",
        plugins : "autocomplete",
        theme_advanced_buttons1 : "bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright,justifyfull,bullist,numlist,undo,redo,link,unlink",
        theme_advanced_buttons2 : "",
        theme_advanced_buttons3 : "",
        theme_advanced_buttons3_add : "",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "",

        autocomplete_options: "john,jane,william",
    });
});
