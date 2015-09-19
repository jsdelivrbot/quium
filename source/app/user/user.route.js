'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:user/:area', {
        templateUrl: 'app/user/user.view.html',
        controller: 'userCtrl'
      })
  })
  .controller('userCtrl', function ($scope, User, Area, $title) {
    User.load()
    .then(function (data) {
      $scope.user = data
    })
  })
