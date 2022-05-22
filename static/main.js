/* script */
const app = {
    version: '1.63',
    title: 'Page::',
    path: {
        tags: 'md/tags'
    },
    loadData: function(){
        $("#app-version").text(app.version);
        // console.log('loading data');
    },
    restore: function(){
        console.clear(); 
        console.log('all clear'); 
        sessionStorage.clear();
        document.location.reload(true);        
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
        // console.log(`Remote page: ${page}`)
        let data_key = `data_${activate_content}`;
        let data_ss = sessionStorage.getItem(data_key);
        if(data_ss!=null && data_ss.length>0){
            // console.log(`\t[${data_key}] found on session`);
            // console.log(`\t${data_ss.slice(0,120)}`)
            $("#remotePage").html(data_ss);
            // console.log(`\t[${data_key}] restored!`);
        }
        else{
            // console.log(`[${data_key}] is Empty!!`);
            $("#remotePage").load(`pages/${page} div.content`, function(){
                // console.log('\nLOADING REMOTE\n');
                if($("#remotePage").find('.sidebar.remote').length > 0){
                    // console.log(`\t-> remote menu found`);
                    let fname = $("#remotePage").find('.sidebar.remote:first').data('md');
                    let md_uri = `${app.path.tags}/${fname}.md`
                    // console.log(`\t-> loading resource: ${md_uri}`);
                    $.get( md_uri, function( data ) {          
                        var converter = new showdown.Converter();
                        $(".sidebar.remote").html(converter.makeHtml(data));
                        sessionStorage.setItem(data_key, $("#remotePage").html());
                    },'text');
                }else{
                    sessionStorage.setItem(data_key, $("#remotePage").html());
                }
            });
            // $("#remotePage").show();
        }
        $("#remotePage").show();
        $("#remotePage .content").show();
        $("#remotePage .content").attr('display', 'block');
    }
    $(ui.content).hide();
    $(`.${activate_content}`).fadeIn(700);
    document.title = `${app.title}${activate_content}`;
}
$(document).ready(function(){

    app.loadData();

    $("body").on('click','.sidebar.remote a',function(e){
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

