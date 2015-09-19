'use strict'

angular.module('crowdferenceApp')
  .directive('primary', function (Questions) {
    return {
      templateUrl: 'components/primary/primary.html',
      restrict: 'E',
      controller: function ($scope, $route, $location) {
        $scope.Questions = Questions

        var nextPage
        var prevPage

        var load = function (first) {
          Questions.load({first: first, topic: $location.search().topic}).then(function (data) {
            $scope.questions = data.questions
            prevPage = data.prevPage
            nextPage = data.nextPage
          })
        }

        $scope.$on('$locationChangeSuccess', function () {
          if ($route.current.params.area) {
            load()
          }
        })

        $scope.$on('login', function () {
          load()
        })
        load()

        $scope.$watch('Questions.params', function () {
          load()
        }, true)

        $scope.next = function () {
          load(nextPage)
        }

        $scope.prev = function () {
          load(prevPage)
        }
      }
    }
  })
