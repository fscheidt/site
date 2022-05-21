/* script */
function loadView(elHash){
    console.log(elHash);
    let target_content = elHash.replace('#','');
    $('nav a').removeClass('active');
    $(`a[href='${elHash}']`).addClass('active');
    $('.content').hide();
    $(`.${target_content}`).fadeIn(700);
}
$(document).ready(function(){
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
});