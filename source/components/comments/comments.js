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
          if ($scope.question.comments.comments[index]) {
            return $popup({
              template: '<comment></comment>',
              scope: {comment: $scope.question.comments.comments[index], question:$scope.question},
              x: $event.pageX,
              y: $event.pageY
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

        $scope.tree()
      }
    }
  })

  .service('Comments', function ($http, User, $q, Area) {
    var rg = /#\d+/g
    var commentMinLength = 10
    var commentMaxLength = 2000
    var family = function () {
      this.comments.forEach(function (comment, index) {
        comment.children = undefined
        comment.parents = undefined
        this.parents[index] = comment
      }, this)
      this.comments.forEach(function (comment) {
        if (comment.response === undefined) {
          comment.response = {
            comment: '#' + comment.count
          }
        }
        if (comment.children === undefined) {
          comment.children = []
        }
        if (comment.parents === undefined) {
          comment.parents = {}
        }
        var id = 0
        var parent = null
        var links = comment.comment[comment.comment.length - 1].comment.match(rg) || []
        this.parents = {}
        while (links.length) {
          id = links.pop()
          if (this.parents[id]) {
            continue
          }
          this.parents[id] = true

          id = id.trim().substr(1) - 1
          parent = this.comments[id]
          if (!parent) {
            continue
          }

          comment.parents[id] = parent

          if (parent.children === undefined) {
            parent.children = [comment]
            continue
          }
          parent.children.push(comment)
        }
      }, this)
    }
    this.Comments = function (question) {
      var that = this
      this.commentMaxLength = commentMaxLength
      this.commentMinLength = commentMinLength
      this.response = {}
      this.family = family
      this.parents = []
      this.question = question
      this.comments = question.comments.comments

      this.family()
      that.permissions = Area.current.permissions
    }
  })
