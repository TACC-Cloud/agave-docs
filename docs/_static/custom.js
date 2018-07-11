$(document).ready(function() {
    $(".foldable").click(function(event) {
        $(this).children().not(".header").toggle(400);
        $(this).children(".header").find("em").toggleClass("fa-caret-right fa-caret-down");
        event.stopPropagation();
    });

    $(".foldable > *").hide();
    $(".foldable .header").show();
});
