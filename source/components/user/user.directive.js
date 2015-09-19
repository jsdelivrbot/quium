'use strict'

angular.module('crowdferenceApp')
  .directive('userView', function () {
    return {
      templateUrl: 'components/user/user.html',
      restrict: 'E',
      controller: function ($scope, User, $title) {
        User.load().then(function () {
          $scope.user = User.view
          $title(User.user.name || User.user.nick) 
        })
        $scope.findUser = User.findUser
        $scope.addManager = User.addManager
        $scope.removeManager = User.removeManager
      }
    }
  })
