'use strict';

angular.module('crowdferenceApp')
  .directive('mouseenterDelayed', function mouseenterDelayed($timeout, $parse) {
    return {
      restrict: 'A',
      //~ scope:{
        //~ mouseenterDelayed:'&?',
        //~ mouseenterDelay:'=?'
      //~ },
      link:function(scope, element, attrs){
        var cancel = false,
        enter = function($event){
          cancel = $timeout(function(){
            $parse(attrs.mouseenterDelayed)(scope,{$event:$event});
          },
          scope.$eval(attrs.mouseenterDelay)||1000);
        },
        leave = function(){
          $timeout.cancel(cancel);
        };

        element.on('mouseenter',enter).on('mouseleave',leave);
      }
    };
  });
