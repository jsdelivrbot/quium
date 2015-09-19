'use strict'

angular.module('crowdferenceApp')
  .controller('AuthCtrl', function ($scope, $interval, $cookies, User) {
    var token = $cookies.token,
      user = $cookies.user,
      error = $cookies.error,
      rolesHash = $cookies.rolesHash

    delete ($cookies.token)
    delete ($cookies.user)
    delete ($cookies.error)
    delete ($cookies.rolesHash)

    User.landed = false
    User.progress = 1

    // windows phone cutre hack... porque no permite abrir pestañas...
    // para hacerlo perfecto, habría que guardar el estado y recuperarlo
    if (window.navigator.userAgent.match(/Windows Phone/)) {
      if (error) {
        localStorage.error = error
      } else {
        localStorage.token = token
        localStorage.user = user
        localStorage.rolesHash = rolesHash
      }
      window.location.reload('/')
      return
    }

    $interval(function () {
      User.progress++
    }, 10, 100).then(function () {
      if (error) {
        localStorage.error = error
      } else {
        localStorage.token = token
        localStorage.user = user
        localStorage.rolesHash = rolesHash
      }

      window.open(location, '_self').close()
    })

  })
