'use strict'

angular.module('crowdferenceApp')
  .directive('languages', function () {
    return {
      templateUrl: 'components/languages/index.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope, $translate, $http) {
        $http.get('https://rawgit.com/crowdference/babel/master/translations.json')
        .then(function (response) {
          $scope.translations = response.data
        })
        $scope.use = $translate.use
      }
    }
  })
