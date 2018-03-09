var layerArray = [
  {
      name: 'Panorama',
      image: 'data/panorama_umweltforschung.xml',
      shape: 'data/panorama_umweltforschung.svg'
  }
];
var titleTranslation = {
  de: 'Panorama der Umweltforschung 2017-2020',
  fr: 'Panorama de la recherche environnementale 2017-2020',
};
var sourceTranslation = {
  de: { text: 'Forschungskonzept Umwelt für die Jahre 2017-2020', link: 'https://www.bafu.admin.ch/bafu/de/home/themen/bildung/publikationen-studien/publikationen/forschungskonzept-umwelt-fuer-die-jahre-2017-2020.html'},
  fr: { text: 'Plan directeur de recherche Environnement pour les années 2017–2020', link: 'https://www.bafu.admin.ch/bafu/fr/home/themes/formation/publications-etudes/publications/plan-directeur-recherche-environnement-annees-2017-2020.html'},
};

var comp = new Composition('.container', layerArray);

$(document).ready(function() {
  comp.initData().then(function(){
    comp.appendControl();
    comp.initTooltip();
    comp.initContent();

    comp.initControl();
    comp.setActiveLayer().then(function(){
      $(window).trigger('hashchange');
    });
  });
});

$(window).on('resize', function(){
  comp.updateTilezoom();
});
