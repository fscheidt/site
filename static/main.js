/* script */
const app = {
    version: '1.41'
}
function loadView(elHash, r=false){    
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
        $('nav a').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        window.location.hash = `#${page}`;
        
        $("#remotePage").load(`pages/${page}.html div.content`);
    });

    $("#remotePage").bind("DOMSubtreeModified", function() {

    });
    $("body").on('click','.sidebar .menu a',function(){
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

