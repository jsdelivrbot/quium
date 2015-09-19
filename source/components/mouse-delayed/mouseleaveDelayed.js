'use strict';

angular.module('crowdferenceApp')
  .directive('mouseleaveDelayed', function mouseleaveDelayed($timeout, $parse) {
    return {
      restrict: 'A',
      //~ scope:{
        //~ mouseleaveDelayed:'&?',
        //~ mouseleaveDelay:'=?'
      //~ },
      link:function(scope, element, attrs){
        window.attrs = attrs;
        window.scope = scope;
        var cancel = false,
        leave = function($event){
          cancel = $timeout(function(){
            $parse(attrs.mouseleaveDelayed)(scope, {$event:$event});
          },
          scope.$eval(attrs.mouseleaveDelay)||1000);
        },
        enter = function(){
          $timeout.cancel(cancel);
        };

        element.on('mouseleave',leave).on('mouseenter',enter);
      }
    };
  });
