/* script */
const app = {
    version: '1.29'
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

    $("a.remote").click(function(){
        let page = $(this).data('h');
        console.log(page);        
        // $("#remotePage").load('pages/tools.html #remoteContent');
        $("#remotePage").load('pages/tools.html div.content');
    });

    $(".sidebar .menu a").click(function(){
        let target = $(this).data('h');
        $('article').hide();
        $(`article.cbody.${target}`).show();
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
});