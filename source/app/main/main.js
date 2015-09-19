'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:area', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
  })
  .controller('MainCtrl', function ($scope, $title) {
    $title('crowdference')
  })

