'use strict'

angular.module('crowdferenceApp')
  .directive('topBar', function () {
    return {
      templateUrl: 'components/topBar/topBar.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, Area) {
        $scope.area = Area.current
      }
    }
  })
