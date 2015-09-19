'use strict';

angular.module('crowdferenceApp')
  .directive('area', function (Area) {
    return {
      templateUrl: 'components/area/area.html',
      restrict: 'E',
      controller:function($scope){
        $scope.area = Area.current;        
      }
    };
  });
