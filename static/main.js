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
        if(clientData.isAndroid)
            pdf_el = `<iframe class="gviewer" src="https://docs.google.com/gview?embedded=true&url=${el.url}&amp;embedded=true"></iframe>`;
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
    version: '1.95.3',
    site: 'https://fscheidt.github.io/site',
    title: 'WEB1',
    prefix: '/site',
    local: false,
    repo: {
      data: null,
      url: `https://github.com/fscheidt/site`,
      api: `https://api.github.com/repos/fscheidt/site/branches/main`,
      getData: function(){
        return app.repo.data || app.repo.getApiData();
      },
      getApiData: function(){
        fetch(app.repo.api)
        .then(response => response.json())
        .then(data => {
          app.repo.data = data;
          $("#app-last-commit").text(
            new Date(data.commit.commit.author.date).toLocaleString('pt-br')
          );
        });
      },
    },
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
        $("#app-repo").text(app.repo.url).attr('href',app.repo.url);
        $("#app-local").text(this.local);
        app.repo.getData();
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
    if(activate_content == 'slides'){ getData(); }
    else if($(entry_el).hasClass('remote')){
      let page = `${activate_content}.html`;
      let data_key = `data_${activate_content}`;
      let data_ss = sessionStorage.getItem(data_key);
      if(data_ss!=null && data_ss.length>0)
        $("#remotePage").html(data_ss);        
      else{
        $("#remotePage").load(`pages/${page} div.content`, function(){
          if($("#remotePage").find('.sidebar.remote').length > 0){
              let fname = $("#remotePage").find('.sidebar.remote:first').data('md');
              let md_uri = `${app.paths[activate_content]}/${fname}.md`;
              $.get( md_uri, function( data ) {          
                var converter = new showdown.Converter();
                $(".sidebar.remote").html(converter.makeHtml(data));
                let uri_links = $(".sidebar.remote a");
                uri_links.each(function(idx, el){
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
    $("body").on('click','.md-content pre',function(e){
      $(this)[0].contentEditable = true;
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
            $.each(codes, function(idx, el){
                $(el).addClass(lang);
                hljs.highlightElement(el);
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
    $("#clear-cache").bind("mouseover mouseout", (ev) => {
        $("#clear-fa").toggleClass('fa-undo-alt fa-sync fa-spin');
    });
    if (window.location.hash.length>1)
        loadView(window.location.hash);
    $(window).on('hashchange', function(e){
        loadView(window.location.hash);
    });
    
});

