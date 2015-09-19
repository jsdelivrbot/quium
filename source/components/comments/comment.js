'use strict'
/* jshint eqeqeq:false*/

angular.module('crowdferenceApp')
  .directive('comment', function ($compile) {
    return {
      templateUrl: 'components/comments/comment.html',
      restrict: 'E',
      compile: function (tElement) {
        var contents = tElement.contents().remove()
        var compiledContents
        return function (scope, iElement) {
          if (!compiledContents) {
            compiledContents = $compile(contents)
          }
          compiledContents(scope, function (clone) {
            iElement.append(clone)
          })
        }
      },
      controller: function ($scope, $element, markdown, $timeout) {
        $scope.newComment = ' #' + $scope.comment.count + ' \n'

        $scope.toogleNewComment = function () {
          if (!$scope.status.respond && !$scope.newComment) {
            $scope.newComment = ' #' + $scope.comment.count + ' \n'
          }
          $scope.status.respond = !$scope.status.respond
        }

        $scope.index = $scope.comment.comment.length - 1

        $scope.$watch('index', function () {
          $scope.show = render()
        })

        var render = function () {
          var txt = $scope.comment.comment[$scope.index].comment.replace(/#(\d+)/g, '<a class="btn btn-sm" ng-click="goToComment($1)" mouseenter-delayed="showComment($event,$1)" mouseenter-delay="1000">#$1</a>')
          txt = markdown(txt)
          $element.find('.txt').empty().append($compile(txt)($scope))
        }
        render()

        $scope.status = {
        }
        $scope.childrenToggle = function () {
          if ($scope.status.showChildren === undefined) {
            $scope.status.showChildren = false
            $timeout(function () {
              $scope.status.showChildren = true
            })
          }else {
            $scope.status.showChildren = !$scope.status.showChildren
          }
        }
      }
    }
  })
