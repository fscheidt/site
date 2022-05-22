/* script */
const app = {
    version: '1.45',
    title: 'Page::'
}
const ui = {
    content: '.content',
    nav_entry: 'nav a',
}
function loadView(elHash){    
    let activate_content = elHash.replace('#','');
    let entry_el = $(`a[href='${elHash}']`);
    $(ui.nav_entry).removeClass('active');
    $(entry_el).addClass('active');
    if($(entry_el).hasClass('remote')){
        let page = `${activate_content}.html`;
        $("#remotePage").load(`pages/${page} div.content`);
        $("#remotePage").show();
    }
    $(ui.content).hide();
    $(`.${activate_content}`).fadeIn(700);
    document.title = `${app.title}${activate_content}`;
}
$(document).ready(function(){
    $("#app-version").text(app.version);

    // $("#remotePage").bind("DOMSubtreeModified", function() {});

    $("body").on('click','.sidebar .menu a.md',function(){
        let fname = $(this).data('md');
        let md_uri = `pages/md/${fname}.md`;
        $.get( md_uri, function( data ) {          
            var converter = new showdown.Converter();
            $(".md-content").html(converter.makeHtml(data));
        },'text');
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
    
});

