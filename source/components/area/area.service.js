'use strict'

angular.module('crowdferenceApp')
  .service('Area', function ($rootScope, $q, $route, $location, $http) {
    var that = this
    var waiting = $q.when()

    this.current = {}
    this.load = function () {
      if (!$route.current || $route.current.params.area === undefined) {
        return
      }
      waiting.then(function () {
        var defer = $q.defer()
        waiting = defer.promise
        $http.get('/api/area/' + $route.current.params.area)
          .then(function (data) {
            _.empty(that.current)
            angular.extend(that.current, data.data.area)
            that.current.url = that.current.url || '_'
            defer.resolve(that)
          })
          .catch(function (data) {
            $location.url('/')
            defer.reject(data)
          })
        return defer.promise
      })
    }

    this.load()
    $rootScope.$on('$locationChangeSuccess', function () {
      if ($route.current.params.area !== undefined && that.current.url !== $route.current.params.area) {
        that.load()
      }
    })

    $rootScope.$on('login', function () {
      that.load()
    })

  })
