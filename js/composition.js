class Composition {
  constructor(selector, layerArray) {
    this.root = $(selector);
    this.language = 'de';
    this.layerIndex = 0;
    this.layerArray = layerArray;
    this.offset = {};
    this.tooltipFlag = false;
    this.contentFlag = false;

    this.clickCoords = [];

    this.shapeTable = [];

    this.enableAnimation = true;
    var userAgent = navigator.userAgent.toLowerCase();
    var reg = /firefox\/([0-9.]+)/g;
    var match = reg.exec(userAgent);
    if(match && match[1]) {
      if(parseFloat(match[1]) < 55){
        this.enableAnimation = false;
      }
    }
  }

  initSVG(){
    var obj = this;
    return new Promise(function(resolve, reject){
      var svgContainer = $('<div></div>').addClass('svg-container').attr('id', 'impressum');
      obj.root.find('.zoom-holder').append(svgContainer);

      var s = Snap(".svg-container");
      Snap.load(obj.layerArray[obj.layerIndex].shape, function(f){
        f.selectAll('g').forEach(function(el){
          const id = el.attr('id')
          if(id){
            if(id.indexOf('item-') !== -1) {
              el.addClass('shape');
              el.mouseover(function(e){
                this.addClass('hover');
                obj.tooltipFlag = this.attr('id');
              });
              el.mousedown(function(e){
                obj.clickCoords = [e.pageX,e.pageY];
              });
              el.click(function(e){
                if(obj.clickCoords[0] == e.pageX && obj.clickCoords[1] == e.pageY){
                  location.hash = obj.language+'&'+this.attr('id');
                }
              });
              el.mouseout(function(e){
                this.removeClass('hover');
                obj.tooltipFlag = false;
              });
            } else if(id.indexOf('anim') !== -1 && obj.enableAnimation) {
              el.addClass('anim')
            } else if(id.indexOf('outline') !== -1) {
              el.addClass('outline')
            }
          }
        });
        s.append(f);
        resolve();
      });
    });
  }
  initData(){
    var obj = this;
    return new Promise(function(resolve, reject){

      $.ajax({
         'url': 'data/shape.translation.json',
         'dataType': 'json',
         'success': function (data) {
             data.shapes.forEach(function(e,i){
               obj.shapeTable[e.id] = e;
             });
             resolve();
         }
     });
   });
  }
  initContent(){
    var obj = this;
    var contentContainer = $('<div></div>').addClass('content-container');
    var contentClose = $('<div></div>').addClass('close').html('&#10005;');
    var inner = $('<div></div>').addClass('inner');
    var content = $('<div></div>').addClass('content');
    inner.append(content);
    contentContainer.append(inner, contentClose);

    $('body').append(contentContainer);
    obj.content = contentContainer;
  }
  updateContent(){
    var obj = this;
    if(obj.contentFlag){
      var content = obj.shapeTable[obj.contentFlag];
      if(content.content != ''){
        obj.content.find('.content').empty();
        obj.content.addClass('active');
        obj.content.find('.content').load('data/content/'+content.content+'_'+obj.language+'.html', function() {
          obj.content.find('h1').append('<a class="head-source" target="_blank" href="'+sourceTranslation[obj.language].link+'">'+sourceTranslation[obj.language].text+'</a>')
        });
      }
    } else {
      obj.content.removeClass('active');
    }
  }
  initTooltip(){
    var obj = this;
    var tooltip = $('<div></div>').addClass('tooltip');
    $('body').append(tooltip);
    obj.tooltip = tooltip;

  }
  updateTooltip(e){
    var obj = this;
    if(obj.tooltipFlag){
      var content = obj.shapeTable[obj.tooltipFlag];
      obj.tooltip.addClass('active');
      var offsetX = e.pageX + obj.tooltip[0].clientWidth + 30 - window.innerWidth;
      if(offsetX <= 0) offsetX = 0;
      obj.tooltip.css({
        'transform': 'translate(' + (e.pageX - offsetX) + 'px, ' + (e.pageY) + 'px)'
      });
      if(content){
        obj.tooltip.html('<div class="title">'+content.number + '. ' + content[obj.language]+'</div><div class="headline">'+content['cat_'+obj.language]+'</div>');
      } else {
        obj.tooltip.html('')
      }
    } else {
      obj.tooltip.removeClass('active');
    }
  }
  initControl(){
    var obj = this;

    obj.control.find('.home-control').on('click', function(e) {
      obj.root.tilezoom('zoom', 10, {left: 0, top: 0});
      location.hash = obj.language;
    });

    obj.content.find('.close').on('click', function(e){
      obj.contentFlag = false;
      obj.updateContent();
      location.hash = obj.language;
    });

    $(window).on('mousemove', function(e){
      obj.updateTooltip(e);
    });

    $(window).on('hashchange', function(){
      var hash = obj.getHash();

      if(hash.language) obj.language = hash.language
      var eles = Snap('.svg-container').selectAll('.shape');
      eles.forEach(function(v,i){
        v.removeClass('active');
      });
      obj.control.find('.home-control').html(titleTranslation[obj.language]);
      document.title = titleTranslation[obj.language];
      obj.logo.html('<a href="https://www.bafu.admin.ch" target="_blank"><img src="img/logo-bafu-'+obj.language+'.svg"></a>');
      obj.imprint.html('<a href="#'+obj.language+'&imprint">'+obj.shapeTable['imprint'][obj.language]+'</a>');


      obj.setActiveContent(hash.id);
    });
  }
  getHash(){
    var hash = location.hash.replace('#', '');
    var hashArray = hash.split('&');
    var language = hashArray[0];
    var id = hashArray[1];
    return { id: id, language: language }
  }
  setActiveContent(id){
    var obj = this;
    if(typeof id == 'string'){
      var ele = Snap('#'+id);
      if(ele != null){
        if(ele.type != 'DIV'){
          ele.addClass('active');
        }
        var shapeBB = ele.node.getBoundingClientRect();
        var holderBB = ele.parent().node.getBoundingClientRect();
        var viewPort = {width: $(window).width(), height: $(window).height()};

        var max = Math.max((shapeBB.width/holderBB.width*10509)/viewPort.width, (shapeBB.height/holderBB.height*7508)/viewPort.height);
        var level = 13 - Math.ceil(max-1);
        if(level < 11) level = 11;
        var left = parseInt(shapeBB.left - holderBB.left);
        var top = parseInt(shapeBB.height * 0.5 + shapeBB.top - holderBB.top);

        obj.root.tilezoom('zoom', level, {left: left, top: top});

        obj.contentFlag = id;
        obj.updateContent();
      }
    } else {
      obj.contentFlag = false;
      obj.updateContent();
    }
  }

  setActiveLayer(){
    var obj = this;
    return new Promise(function(resolve, reject){
      obj.destroyTilezoom();
      obj.initTilezoom().then(function(){
        resolve();
      });
    });
  }
  destroyTilezoom(){
    var obj = this;
    obj.root.tilezoom('destroy');
  }

  initTilezoom(){
    var obj = this;
    return new Promise(function(resolve, reject){
      obj.root.tilezoom({
          xml: obj.layerArray[obj.layerIndex].image,
          mousewheel: true,
          gestures: true,
          navigation: false,
          zoomIn: '.zoom-in-button',
          zoomOut: '.zoom-out-button',
          speed: 300,
          afterZoom: function(c){
            obj.offset.left = parseInt(c.find('.zoom-holder').css('left'), 10);
            obj.offset.top = parseInt(c.find('.zoom-holder').css('top'), 10);
            obj.offset.level = c.data('tilezoom.settings').level;
          },
          callBefore: function(c){
            obj.root.addClass('moving');
            obj.contentFlag = false;
            obj.updateContent();
            location.hash = obj.language;
          },
          callAfter: function(c){
            obj.root.removeClass('moving');
            obj.offset.left = parseInt(c.find('.zoom-holder').css('left'), 10);
            obj.offset.top = parseInt(c.find('.zoom-holder').css('top'), 10);
            obj.offset.level = c.data('tilezoom.settings').level;
          },

          initialized: function(c){
            obj.repositionTilezoom();
            obj.initSVG().then(function(){
              resolve();
            });
          }
        });
      });
  }
  repositionTilezoom(){
    var obj = this;
    obj.root.tilezoom('reposition', obj.offset.level, {left: obj.offset.left, top: obj.offset.top}, 0);
  }
  updateTilezoom(){
    var obj = this;
    obj.root.tilezoom('update');
  }

  appendControl(){
    var obj = this;
    var control = $('<div></div>').addClass('control noselect');
    var bafuLogo = $('<div></div>').addClass('logo');
    var imprint = $('<div></div>').addClass('imprint');
    var homeControl = $('<div></div>').addClass('home-control clearfix');
    var zoomControl = $('<div></div>').addClass('zoom-control clearfix');
    var zoomInButton = $('<div></div>').addClass('zoom-button zoom-in-button').html('<svg class="icon icon-plus"><use xlink:href="#icon-plus"></use></svg>');
    var zoomOutButton = $('<div></div>').addClass('zoom-button zoom-out-button').html('<svg class="icon icon-minus"><use xlink:href="#icon-minus"></use></svg>');

    zoomControl.append(zoomOutButton, zoomInButton);

    control.append(homeControl, zoomControl);
    obj.root.after(control);
    obj.root.after(bafuLogo);
    obj.root.after(imprint);
    obj.imprint = imprint;
    obj.logo = bafuLogo;
    obj.control = control;
  }
}
