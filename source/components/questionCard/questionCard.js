'use strict'

angular.module('crowdferenceApp')
  .directive('questionCard', function () {
    return {
      templateUrl: 'components/questionCard/questionCard.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope, Question) {
        $scope.checkVoted = Question.checkVoted.bind($scope.question)
        $scope.vote = Question.vote.bind($scope.question)
      }
    }
  })
