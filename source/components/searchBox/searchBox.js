'use strict'

angular.module('crowdferenceApp')
  .directive('searchBox', function () {
    return {
      templateUrl: 'components/searchBox/searchBox.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope, $location, $route) {
        $scope.search = function () {
          $location.$$search ={topic:$scope.topic}
          $location.$$path = '/search/' + ($route.current.params.user || 'all')
          $location.$$compose()
        }
      }
    }
  })
