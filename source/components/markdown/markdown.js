'use strict';

angular.module('crowdferenceApp')
  .service('markdown', function markdown(marked) {
    return function(txt){
      txt = txt || '';
      txt = window.toMarkdown(txt);
      txt = txt.replace(/&gt;/g,'>');
      txt = txt.replace(/&lt;/g,'<');
      txt = window.toMarkdown(txt);
      
      return marked(txt);
    };
  });
