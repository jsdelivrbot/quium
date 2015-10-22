'use strict'

angular.module('crowdferenceApp', [
  'crowdference',
  'ngTouch',
  'ui.bootstrap',
  'ngRoute',
  'pascalprecht.translate',
  'ga',
  'monospaced.elastic',
  'hc.marked'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/_'
      })
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix('!')
  })
  .config(function(msdElasticConfig) {
    msdElasticConfig.append = '\n\n';
  })
  .config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/assets/translations/',
      suffix: '.json'
    })
    $translateProvider.fallbackLanguage('en')
    var language = window.navigator.userLanguage || window.navigator.language || 'es'
    $translateProvider.preferredLanguage(language)
  })
  .config(function (markedProvider) {
    var renderer = new window.marked.Renderer()
    renderer.heading = function (text, level) {
      return '<div class="md-h' + level + '">' + text + '</div>'
    }
    renderer.link = function (href, title, text) {
      return '<a target="_blank" rel="nofollow" href="' + href + '"' + (title && (' title="' + title + '"')) + '>' + text + '</a>'
    }
    markedProvider.setOptions({
      renderer: renderer,
      breaks: true,
      smartLists: true
    })
  })
  .run(function ($rootScope, User, Question, Area, $location, $modal) {
    $rootScope.goToUser = function (user, area) {
      area = area || Area.view || {}
      User.view = user
      Area.view = area
      $location.$$search = {}
      $location.path('/user/' + user._id + '/' + (area.url || '_'))
    }
    $rootScope.goToQuestion = function (question) {
      Question.view = question
      Area.view = question.area
      $location.$$search = {}
      $location.path('/question/' + question._id)
    }
    $rootScope.goToArea = function (area) {
      Area.view = area
      $location.$$search = {}
      $location.path(area._url || '_')
    }
    $rootScope.canIedit = function (user) {
      return User.user._id === user._id || User.user.users.indexOf(user._id) !== -1
    }


    $rootScope.Area = Area

    $rootScope.showVotes = function (votes) {
      $modal.open({
        templateUrl: 'components/votes/showVotes.html',
        controller: function ($scope, $rootScope) {
          $scope.votes = votes
          $rootScope.$on('$locationChangeSuccess', function () {
            $scope.$close()
          })
        },
        size: 'lg'
      })
    }
  })

_.empty = function (object) {
  _.forOwn(object, function (value, key) {
    delete (object[key])
  })
}
