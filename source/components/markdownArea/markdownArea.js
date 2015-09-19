'use strict';
/* jshint multistr:true */
/* jshint eqeqeq:false*/

angular.module('crowdferenceApp')
  .directive('markdownArea', function markdownArea(markdown, $timeout) {
    return {
      restrict: 'E',
      templateUrl:'components/markdownArea/markdownArea.html',
      replace:true,
      scope:{
        ngModel:'=?',
        active:'=?',
        ngChange:'@?',
        render:'&?',
        edit:'&?',
        editable:'&?',
        view:'&?',
        placeholder:'@',
        multiline:'=?',
        markdown:'=?'
      },
      link:function(scope, element){

        var markdownAreaEditResize  = element.children('.markdownAreaEditResize'),
            markdownAreaView        = element.children('.markdownAreaView'),
            markdownAreaEdit        = element.children('.markdownAreaEdit'),
            edit                    = function(){
              if(typeof scope.edit!=='function' || scope.edit()!==false){
                element.addClass('active');
                scope.active=true;
                $timeout(function(){
                  markdownAreaEdit[0].focus();
                });
                element.css('height',markdownAreaEditResize.css('height'));
              }
            },
            view                    = function(){
              if(typeof scope.view!=='function' || scope.view()!==false){
                element.removeClass('active');
                scope.active=false;
                var txt = (scope.render && scope.render()) || markdown(scope.ngModel);
                scope.markdown = txt.compiled || txt;
                markdownAreaView.empty().append(scope.markdown);
                element.css('height',markdownAreaView.css('height'));                
              }
            }
        ;
    
        scope.ngModel = scope.ngModel || '';
        scope.active = scope.active || false;

        element.addClass('markdownArea');

        scope.$watch('active',function(){
          if(scope.active){
            edit();
          }else{
            view();
          }
        });
        scope.$watch('ngModel',function(){
          element.css('height',markdownAreaEditResize.css('height'));
          markdownAreaEdit.css('height',markdownAreaEditResize.css('height'));

          if(!scope.active){
            view();
          }else{
            edit();
          }


          if(!scope.ngModel){
            element.addClass('isEmpty');
          }else{
            element.removeClass('isEmpty');
          }

        });


        scope.$watch(function(){
          return scope.editable && scope.editable();
        }, function(newValue){
          if(newValue){
            element.addClass('editable clickable');
          }else{
            element.removeClass('editable clickable');
          }
        });

        if(scope.multiline === false){
          markdownAreaEdit.keydown(function(event){
            if(event.keyCode===13){
              event.preventDefault();
            }
          });
        }
        
        markdownAreaView.on('click',edit);
        
        markdownAreaEdit.on('blur',view);

        markdownAreaEdit.on('paste', function(e){
          e.preventDefault();

          var text = e.originalEvent.clipboardData.getData('text/html') || e.originalEvent.clipboardData.getData('text/plain');

          text = window.toMarkdown(text);
          text = text.replace(/<[^>]*?>/g,'');
          if(scope.multiline === false){
            text = text.replace(/\n/g,' ');
          }

          try{
            document.execCommand('insertText', false, text);
          }catch(error){
            var textarea = e.currentTarget;
            
            textarea.value = textarea.value.substring(0, textarea.selectionStart) + text + textarea.value.substring(textarea.selectionEnd, textarea.value.length);
          }

        });

        $timeout(function(){ // parche para evitar que en los móviles no se ajuste el tamaño al real

          if(scope.active){
            edit();
          }else{
            view();
          }
        }, 500);

        markdownAreaEdit.bind('focus', function(){
          scope.active = true;
        });
        markdownAreaEdit.bind('blur', function(){
          scope.active = false;
        });

        scope.$on('login', function(){
          $timeout(function(){ // parche para evitar que en los móviles no se ajuste el tamaño al real
            if(scope.active){
              edit();
            }else{
              view();
            }
          });
        });

      }
    };
  });
