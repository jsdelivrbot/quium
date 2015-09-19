'use strict'

angular.module('crowdferenceApp')
  .service('Questions', function ($http, $route) {

    var loading

    this.params = {
      which: 'all',
      sort: '24h',
      as: 'target'
    }

    this.load = function (params) {
      if (loading) {
        return loading
      }

      params = angular.extend({}, this.params, params)
      var url
      var query

      if ($route.current.params.area) {
        if (params.as === 'all') {
          params.as = 'target'
        }
        url = '/api/questions/' + $route.current.params.area
        if ($route.current.params.user) {
          url = url + '/' + $route.current.params.user + '/' + params.which + '/' + params.as + '/' + params.sort
        }else {
          url = url + '/' + params.which + '/' + params.sort
        }
        query = {
          size: params.size,
          first: params.first
        }
      }else {
        if (params.as === 'votes') {
          params.as = 'target'
        }
        url = '/api/search/'
        if ($route.current.params.user !== 'all') {
          url = url + '/' + $route.current.params.user + '/' + params.which + '/' + params.as
        }else {
          url = url
        }
        query = {
          size: params.size,
          first: params.first,
          topic: params.topic
        }

      }

      loading = $http.get(url, {params: query})
      .then(function (data) {
        loading = false
        return data.data
      })
      .catch(function () {
        loading = false
      })

      return loading
    }
  })
