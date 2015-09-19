'use strict'

angular.module('crowdferenceApp')
  .directive('newComment', function () {
    return {
      templateUrl: 'components/comments/newComment.html',
      restrict: 'E',
      controller: function ($scope, $http, User) {
        $scope.save = function () {
          User.$http.post('/api/comments/' + $scope.question._id, {comment: $scope.newComment})
          .then(function (response) {
            $scope.question.comments = response.data.comments
            $scope.newComment = ''
            if ($scope.status) {
              $scope.status.respond = false
            }
            $scope.tree()
          })
        }
      }
    }
  })
