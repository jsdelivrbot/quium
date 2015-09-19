'use strict'

angular.module('crowdferenceApp')
  .service('$title', function $title ($rootScope, $location, $translate, ga) {
    var translatedTitle = '',
      params = {},
      title = '',
      setTitle = function () {
        return $translate(title, params).then(function (newTitle) {
          translatedTitle = newTitle
          window.document.title = translatedTitle
        })
      },
      main = function (newTitle, newParams, analytics) {
        if (!newTitle) {
          return translatedTitle
        }
        params = newParams || {}
        title = newTitle

        return setTitle().then(function () {
          if (!analytics) {
            ga('send', 'pageview', {page: $location.url(), title: translatedTitle})
          }
        })

      }


    $rootScope.$on('$translateChangeSuccess', function () {
      setTitle(title, params)
    })

    return main

  })
