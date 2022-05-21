/* script */
const app = {
    version: '1.28'
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
    $(".sidebar .menu a").click(function(){
        let target = $(this).data('h');
        console.log(target);
        $('article').hide();
        $(`article.cbody.${target}`).show();
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
});