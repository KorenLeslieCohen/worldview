$(document).ready(function(){


    $('.clock-row').on('click', '.ul-clock', function(){
        var target = $('#weather-anchor');
        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});