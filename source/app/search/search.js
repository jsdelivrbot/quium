'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/search/:user', {
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      })
  })
  .controller('SearchCtrl', function ($scope, $title, $route, User) {
    $title('crowdference')
    if ($route.current.params.user === 'all') {
      User.view = {}
    }
  })

