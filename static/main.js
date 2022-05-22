/* script */
const app = {
    version: '1.48',
    title: 'Page::',
    path: {
        tags: 'md/tags'
    }
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

    // $("#remotePage33").bind("DOMSubtreeModified", function() {
    //     console.log('remote detected');
    // });
    $("#remotePage").bind('DOMNodeInserted', function(){
        console.log('remote detected');
        $("#remotePage").unbind('DOMNodeInserted');
        if($("#remotePage").find('.sidebar.remote').length > 0){
            console.log('remote menu found');
            let fname = $("#remotePage").find('.sidebar.remote:first').data('md');
            let md_uri = `${app.path.tags}/${fname}.md`
            console.log(md_uri);
            $.get( md_uri, function( data ) {          
                var converter = new showdown.Converter();
                $(".sidebar.remote").html(converter.makeHtml(data));
            },'text');
        }
    });

    $("body").on('click','.sidebar.remote a',function(e){
        // let fname = $(this).data('md');
        // let md_uri = `pages/md/${fname}.md`;
        let md_uri = $(this).attr('href');
        $.get( md_uri, function( data ) {          
            var converter = new showdown.Converter();
            $(".md-content").html(converter.makeHtml(data));
        },'text');
        e.stopPropagation();
        e.preventDefault();
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
    
});

