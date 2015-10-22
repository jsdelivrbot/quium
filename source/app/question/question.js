'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/question/:question', {
        templateUrl: 'app/question/question.html',
        controller: 'QuestionCtrl',
        reloadOnSearch: false,
        resolve: {
          question: function (Question) {
            return Question.load()
          }
        }
      })
  })
  .controller('QuestionCtrl', function ($scope, $title, Question, question, Area, $translate) {
    $scope.question = question

    _.empty(Area.current)
    angular.extend(Area.current, question.area)
    Area.current.url = Area.current.url || '_'

    $scope.checkVoted = Question.checkVoted.bind($scope.question)
    $scope.vote = Question.vote.bind($scope.question)

    $scope.index = {
      question: $scope.question.question.length - 1,
      answer: $scope.question.answer.length - 1
    }
    $scope.maxIndex = {
      question: $scope.question.question.length - 1,
      answer: $scope.question.answer.length - 1
    }

    $scope.save = Question.save.bind(Question)

    $title($scope.question.question[$scope.maxIndex.question].question)

    $scope.canIanswer = function () {
      return $scope.user._id === $scope.question.target._id || $scope.user.users.indexOf($scope.question.target._id) !== -1
    }

    $scope.popup = function (where) {
      $translate('share.text', {name: question.target.name}).then(function (text) {
        var url = null
        var screenX = window.screenX || window.screenLeft
        var screenY = window.screenY || window.screenTop
        var outerWidth = window.outerWidth || document.body.clientWidth
        var outerHeight = window.outerHeight || (document.body.clientHeight - 22)
        var width = 700
        var height = 500
        var left = parseInt(screenX + ((outerWidth - width) / 2), 10)
        var top = parseInt(screenY + ((outerHeight - height) / 2.5), 10)
        var features = (
          'width=' + width +
          ',height=' + height +
          ',left=' + left +
          ',top=' + top
        )
        switch (where) {
          case 'twitter':
            url = 'https://twitter.com/intent/tweet?text=' + text + encodeURIComponent('\n' + window.location.href)
            break
          case 'google':
            url = 'https://plus.google.com/share?url=' + window.location.href
            break
          case 'facebook':
            url = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(window.location.href) + '&t=' + text
            break
        }
        window.open(url, '_blank', features)
      })
    }
  })
