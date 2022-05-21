/* script */
const app = {
    version: '1.12'
}
function loadView(elHash){    
    let target_content = elHash.replace('#','');
    $('nav a').removeClass('active');
    $(`a[href='${elHash}']`).addClass('active');
    $('.content').hide();
    $(`.${target_content}`).fadeIn(700);
}
$(document).ready(function(){
    $("#app-version").text(app.version);
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
});