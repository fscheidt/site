/* script */
const clientData = {
    screen: `${window.screen.availWidth} x ${window.screen.availHeight}`,
    agent: navigator.userAgent.toLowerCase(),
    isAndroid: /(android)/i.test(navigator.userAgent),
    tohtml: function(){
        return `<dl>
        <dt>screen</dt><dd>${this.screen}</dd>
        <dt>mobile</dt><dd>${this.isAndroid}</dd>
        <dt>agent</dt><dd>${this.agent}</dd>
        </dl>`
    }
}
function getData(){
    $.getJSON( "pages/data.json", function( data ) {
        $("#slide-set").html('');
        $.each( data, function( key, val ) {
            let slides = data[key];
            slides.forEach(el => {
                let pdf_el = `<object class="pdf" data="${el.url}" type='application/pdf'></object>`;
                if(clientData.isAndroid){
                    pdf_el = `<iframe class="gviewer" src="https://docs.google.com/gview?embedded=true&url=${el.url}&amp;embedded=true"></iframe>`;
                }
                $("<details/>", {                                
                    class: 'sld',
                    html: `<summary class="title">
                    ${el.title}
                    </summary>
                    ${pdf_el}`
                  }).appendTo("#slide-set");
            });
        });
    })
}
const app = {
    version: '1.94',
    site: 'https://fscheidt.github.io/site',
    repo: 'https://github.com/fscheidt/site',
    title: 'WEB1',
    prefix: '/site',
    local: false,
    paths: {
            "html": "md/html",
            "css": "md/css",
            "js": "md/js"
    },
    isLocal: function(url){
        return url.indexOf('localhost') !== -1 || url.indexOf('127.0.0.1') !== -1;
    },
    loadData: function(){
        this.client = navigator.userAgent.toLowerCase();
        this.local = this.isLocal(document.location.href);
        $("#app-version").text(this.version);
        $("#app-site").text(this.site).attr('href',this.site);
        $("#app-repo").text(app.repo).attr('href',app.repo);
        $("#app-local").text(this.local);
        $("#app-client").html(clientData.tohtml());
        if(this.local){
            this.prefix = '';
            this.title = `🚩 ${this.title}`;
        }
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
    // console.log("activate_content: " + activate_content);
    if(activate_content == 'slides'){
        getData();
    }
    else if($(entry_el).hasClass('remote')){
        let page = `${activate_content}.html`;
        // console.log(`Content: ${activate_content}`)
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
                    let md_uri = `${app.paths[activate_content]}/${fname}.md`;
                    // console.log(`\t-> loading resource: ${md_uri}`);
                    $.get( md_uri, function( data ) {          
                        var converter = new showdown.Converter();
                        $(".sidebar.remote").html(converter.makeHtml(data));
                        let uri_links = $(".sidebar.remote a");
                        uri_links.each(function(idx, el){
                            // console.log(el);
                            let href = $(this).attr('href');
                            $(this).addClass(activate_content);
                            if(!app.local){
                                if (!href.startsWith(app.prefix))
                                    $(this).attr('href',`${app.prefix}${href}`);                            
                            }
                        });
                        
                        sessionStorage.setItem(data_key, $("#remotePage").html());
                    },'text');
                }else{
                    sessionStorage.setItem(data_key, $("#remotePage").html());
                }
            });
        }
        $("#remotePage").show();
        $("#remotePage .content").show();
        $("#remotePage .content").attr('display', 'block');
    }
    $(ui.content).hide();
    $(`.${activate_content}`).fadeIn(700);
    document.title = `${app.title} ➱ ${activate_content}`;
}
$(document).ready(function(){

    app.loadData();

    $("#generate").click(function(){    
        $("#rndColor").html("");
        let colors = Array.apply(null, new Array(10)).map(() => {return chroma.random();});
        colors.forEach(el => {            
            $("<div/>",{
                html:`<b>${el}</b>`,
                class:'cb',
                style:`background:${el}`}).appendTo("#rndColor");
        });
    });
    $("body").on('mouseover','.cb',function(e){
        $('div.render-bx').html('');
        $('div.palette').html('');
        let target = $(this).text();
        let color_set = [
            chroma(target).darken(),chroma(target).darken(2),chroma(target).darken(2.6),
            chroma(target).brighten(),chroma(target).brighten(2),chroma(target).brighten(3)
        ];
        color_set.forEach(el => {   
            $("<div/>",{
                html:`<b>${el}</b>`,
                class:'cb2',
                style:`background:${el}`}
            ).appendTo("div.palette");
        });
    });
    $("body").on('click','.sidebar.remote a',function(e){
        let md_uri = $(this).attr('href');
        let lang = $(this).attr('class');
        $.get( md_uri, function( data ) {          
            let converter = new showdown.Converter();
            let el = $(converter.makeHtml(data));
            $(el).attr('class',`${lang}`);
            $(el).find('code').attr('class',`${lang}`);            
            $(".md-content").html(el);
        },'text');
        e.stopPropagation();
        e.preventDefault();
    });
    $("#remotePage").on('DOMNodeInserted', function(e) {
        if ( $(e.target).find('pre > code').length > 0 ) {
            let preEl = $(e.target).find("pre:first");
            let lang = preEl.attr('class');
            let codes = $(e.target).find("pre > code");
            // hljs.configure({ tabReplace: '  ' });
            $.each(codes, function(idx, el){
                // console.log(el);
                $(el).addClass(lang);
                hljs.highlightElement(el);
                // hljs.highlightElement(el, { tabReplace: '  ' });
            });
        }
    });
    $("body").on('click','.hmenu a',function(e){
        $('.hmenu a').removeClass("take");
        $(this).toggleClass("take");
        let tagName = $(this).data('h');          
        $(`.list-card li`).hide();        
        $(tagName).parent().show();
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
    
});

