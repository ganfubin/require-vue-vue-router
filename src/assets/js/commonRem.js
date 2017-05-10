
(function($){
    var size = 0;
    var size2 = 0;
    $(window).resize(infinite);
    function infinite() {
        var htmlWidth = $('html').width();
        if (htmlWidth >= 750) {
            $("html").css({
                "font-size" : "26.67px"
            });
        } else {
            $("html").css({
                "font-size" :  26.67 / 750 * htmlWidth + "px"
            });
        }
        size = 26.67 / 750 * htmlWidth * 9.67;
        size2 = 26.67 / 750 * htmlWidth * 3.19;
    }
    infinite();

    $('.item h2').on('touchstart', function() {
        if($(this).parent().hasClass('show')) {
            $(this).parent().stop(true).animate({height : size2}, 300);
            $(this).parent().removeClass('show');
        } else {
            $(this).parent().stop(true).animate({height : size}, 300);
            $(this).parent().addClass('show');
        }
    })
})(jQuery);