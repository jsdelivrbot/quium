'use strict'

angular.module('crowdferenceApp')
  .directive('paramsNav', function () {
    return {
      templateUrl: 'components/paramsNav/paramsNav.html',
      restrict: 'E',
      replace: true,
      translate: true,
      scope: {
        key: '@'
      },
      controller: function ($scope, Questions, $route) {
        $scope.params = Questions.params
        if ($scope.key === 'as') {
          $scope.$on('$locationChangeSuccess', function () {
            $scope.hide = ($route.current.params.user === undefined) || ($route.current.params.user === 'all')
            $scope.options = $route.current.params.area ? ['user', 'target', 'votes'] : ['user', 'target', 'all']
          })
        } else {
          $scope.options = {
            which: ['all', 'answer', 'question'],
            sort: ['last', '24h', '1w', '1m', '1y', 'ever']
          }[$scope.key]
        }
      }
    }
  })
