'use strict'
/* jshint camelcase:false*/
angular.module('crowdferenceApp')
.service('User', function ($rootScope, $translate, $http, $location, $route, $q) {
  var that = this
  var logged = false
  var noname = function () {
    if (!logged) {
      $translate('userArea.login').then(function (translation) {
        that.user.name = translation
      })
    }
  }
  var setUser = function (user) {
    logged = !(!user._id)
    _.empty(that.user)
    angular.extend(that.user, user)
  }
  var setAnonymous = function () {
    _.empty(that.user)
    logged = false
    that.user.image = '/assets/images/user.png'
    that.user.users = []
    noname()
  }

  this.user = {}

  this.logout = this.logout = function () {
    sessionStorage.clear()
    localStorage.clear()
    window.location.reload()
  }

  var httploged = function (url, param1, param2, param3) {
    if (logged) {
      return $http[this](url, param1, param2, param3)
    }else {
      localStorage.firstCall = JSON.stringify([$location.path(), this, url, param1, param2, param3])
      $location.path('/sys/login')
      return $q.reject()
    }
  }

  this.$http = {
    get: httploged.bind('get'),
    post: httploged.bind('post'),
    put: httploged.bind('put'),
    delete: httploged.bind('delete')
  }

  this.loginAs = function (user) {
    $location.path('/sys/login?type=' + user.profile.type)
  }

  this.useUser = function (user) {
    this.user.use = user
    sessionStorage.user = user._id
  }

  this.findUser = function (q) {
    return $http.get('/api/user/typeahead?q=' + q)
    .then(function (response) {
      return response.data.users
    })
  }

  this.addManager = function ($model) {
    $http.post('/api/user/manager/' + $model._id)
    .then(function () {
      this.user.managers.push($model)
    }.bind(this))
  }

  this.removeManager = function (index) {
    $http.delete('/api/user/manager/' + this.user.managers[index]._id)
    .then(function () {
      this.user.managers.splice(index, 1)
    }.bind(this))
  }


  this.view = {}
  var loading = false
  this.load = function () {
    loading = this.loading.then(function () {
      if ($route.current.params.user === 'all') {
        this.view = {}
        return $q.when(this.view)
      }
      if ($route.current.params.user === this.user._id) {
        this.view = this.user
        return $q.when(this.view)
      }
      if ($route.current.params.user === this.view._id) {
        return $q.when(this.view)
      }
      if (!loading) {
        return $http.get('/api/user/' + $route.current.params.user)
        .then(function (response) {
          loading = false
          this.view = response.data.user
          return this.view
        }.bind(this))
        .catch(function () {
          loading = false
        })
      }
    }.bind(this))
    return loading
  }
  this.reload = function () {
    $rootScope.$on('$translateChangeSuccess', noname)
    if (localStorage.token) {
      this.loading = $http.get('/api/user')
      .then(function (response) {
        setUser(response.data.user)
      })
      .catch(function () {
        localStorage.clear()
        setAnonymous()
      })
    }else {
      this.loading = $q.when()
      setAnonymous()
    }
  }
  this.reload()
})
