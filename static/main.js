/* script */
$(document).ready(function(){
    $('nav a').click(function(e){
        let target = $(this).data('el');
        $('.content,nav a').removeClass('active');
        $(`.${target}`).addClass('active');
        $(this).addClass('active');
    });
});