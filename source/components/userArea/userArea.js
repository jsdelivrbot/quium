'use strict'

angular.module('crowdferenceApp')
  .directive('userArea', function () {
    return {
      templateUrl: 'components/userArea/userArea.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope, User) {
        $scope.user = User.user
        $scope.logout = User.logout
        $scope.login2 = User.loggedRequired
        $scope.useUser = User.useUser
        $scope.removeNotification = function ($index) {
          User.notifications.splice($index, 1)
        }
      }
    }
  })
