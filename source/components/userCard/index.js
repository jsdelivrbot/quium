'use strict'

angular.module('crowdferenceApp')
.directive('userCard', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/userCard/index.html',
    replace: true,
    scope: {
      'user': '=',
      'href': '@?'
    },
    controller: function ($rootScope, $scope) {
      if ($scope.href) {
        $scope.click = function () {
          window.location = $scope.href
        }
      }else {
        $scope.click = $rootScope.goToUser
      }
    }
  }
})
