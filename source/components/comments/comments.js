'use strict'

angular.module('crowdferenceApp')
  .directive('comments', function () {
    return {
      templateUrl: 'components/comments/comments.html',
      restrict: 'E',
      controller: function ($scope, User, $http, $anchorScroll, $location, $popup) {
        $scope.goToComment = function (index) {
          if (angular.element('#comment-' + index)) {
            $location.hash('comment-' + index)
            $anchorScroll()
          }
        }

        $scope.showComment = function ($event, index) {
          if ($scope.question.comments.comments[index - 1]) {
            return $popup({
              template: '<comment></comment>',
              scope: {comment: $scope.question.comments.comments[index - 1], question: $scope.question},
              x: $event.pageX,
              y: $event.pageY,
              width: $($event.currentTarget).parents('.comment').width()
            })
          }
        }
        $scope.vote = function (comment, vote) {
          var myVote = $scope.checkVoted(comment)

          if (vote === myVote) {
            return
          }
          if (vote === -myVote) {
            vote = 0
          }

          User.$http.post('/api/comments/' + comment._id + '/' + vote)
          .then(function (response) {
            comment.votes = response.data.votes
          })
        }
        $scope.checkVoted = function (comment) {
          var myVote = null
          comment.votes.votes.some(function (vote) {
            if (vote.user._id === User.user._id) {
              myVote = vote.vote
              return true
            }
          })
          return myVote
        }

        var rg = /#\d+/g
        $scope.tree = function () {
          $scope.question.comments.comments.forEach(function (comment) {
            var links = comment.comment[comment.comment.length - 1].comment.match(rg)
            if (links === null) {
              return
            }
            links.forEach(function (link) {
              link = link.substr(1) - 1
              if (!this[link]) {
                return
              }
              this[link].children = this[link].children || []
              this[link].children.push(comment)
            }, this)
          }, $scope.question.comments.comments)
        }

        $scope.edit = function (comment, $value) {
          return $http.put('/api/comments/' + comment._id, {comment: $value})
        }

        $scope.tree()
      }
    }
  })
