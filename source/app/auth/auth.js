'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sys/auth', {
        templateUrl: 'app/auth/authview.html',
        controller: 'AuthCtrl'
      })
  })
