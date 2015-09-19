'use strict'

angular.module('crowdferenceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sys/login', {
        templateUrl: 'app/login/login.html',
        controller: 'loginCtrl'
      })
      .when('/sys/login/:token', {
        templateUrl: 'app/login/loginCallback.html',
        controller: 'loginCallbackCtrl'
      })
  })
  .controller('loginCtrl', function loginCtrl ($scope, $route, $location, $http, Question) {
    var oauths = [
      {
        name: 'twitter',
        icon: 'tw.png',
        url: '/api/auth/twitter/redirect/'
      },
      {
        name: 'google',
        icon: 'g+.png',
        url: 'https://accounts.google.com/o/oauth2/auth?client_id={{client_id}}&response_type=code&scope=profile email&redirect_uri={{protocol}}//{{host}}/api/auth/google'
      },
      {
        name: 'facebook',
        icon: 'fb.png',
        url: 'https://www.facebook.com/dialog/oauth?client_id={{client_id}}&display=popup&scopes=basic_info&redirect_uri={{protocol}}//{{host}}/api/auth/facebook/'
      },
      {
        name: 'linkedin',
        icon: 'in.png',
        url: 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id={{client_id}}&scope=r_fullprofile r_emailaddress&state={{protocol}}&redirect_uri={{protocol}}//{{host}}/api/auth/linkedin'
      }
    ]

    $http.get('api/config/oauth')
    .then(function (response) {
      $scope.config = response.data.config
      oauths.forEach(function (oauth) {
        if (!$scope.config[oauth.name]) {
          oauth.url = false
          return
        }
        oauth.url = oauth.url
          .replace(/{{protocol}}/g, window.location.protocol)
          .replace(/{{host}}/g, window.location.host)
          .replace(/{{client_id}}/g, $scope.config[oauth.name])
      })
    })

    $scope.oauths = oauths

    if ($location.search().target && Question.view.target) {
      $scope.user = Question.view.target
      $scope.oauths = oauths.filter(function (oauth) {
        return oauth.name === $scope.user.profile.type
      })
      localStorage.back = '/question/' + Question.view._id
    }else {
      $scope.user = false
    }

    $scope.sendCode = function (email) {
      $http.post('/api/auth/email', {email: email})
        .then(function (data) {
          $scope.hmac = data.data.hmac
          $scope.session = data.data.session
        })
    }

    $scope.anyOauth = function () {
      return $scope.oauths.length
    }
  })
  .controller('loginCallbackCtrl', function loginCtrl ($scope, $location, $http, $route, User) {

    localStorage.token = $route.current.params.token
    User.reload()

    if (localStorage.firstCall) {
      var params = JSON.parse(localStorage.firstCall)
      delete localStorage.firstCall
      var path = params.shift()
      var method = params.shift()
      $http[method].apply($http, params)
      .then(function () {
        if (method === 'post' && params[0].match(/^\/api\/question\/[a-f0-9]{24}\/[a-f0-9]{24}$/)) {
          $location.path(params[0].replace(/^\/api(\/question\/[a-f0-9]{24})\/[a-f0-9]{24}$/, '$1'))
          return
        }else {
          $location.path(path)
        }
      })
    }else {
      $location.path(localStorage.back || '/')
      delete localStorage.back
    }
  })
