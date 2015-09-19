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
  .controller('QuestionCtrl', function ($scope, $title, Question, question, Area) {
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

    $scope.save = function (response) {
      Question.respond(response)
      .then(function () {
        $scope.maxIndex.answer = $scope.question.answer.length - 1
        $scope.index.answer = $scope.question.answer.length - 1
      })
    }

    $title($scope.question.question[$scope.maxIndex.question].short)

    $scope.canIanswer = function () {
      return $scope.user._id === $scope.question.target._id || $scope.user.users.indexOf($scope.question.target._id) !== -1
    }

  })
