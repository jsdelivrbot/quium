'use strict'

angular.module('crowdferenceApp')
  .service('$auth', function $auth ($http, $q, $location) {
    var that = this

    var eventBind = false

    this.oauths = [
      {
        name: 'twitter',
        icon: 'tw.png',
        url: '/auth/twitter/redirect/'
      },
      {
        name: 'google',
        icon: 'g+.png',
        url: 'https://accounts.google.com/o/oauth2/auth?client_id={{client_id}}&response_type=code&scope=profile email&redirect_uri={{protocol}}//{{host}}/auth/google&state={{protocol}}'
      },
      {
        name: 'facebook',
        icon: 'fb.png',
        url: 'https://www.facebook.com/dialog/oauth?client_id={{client_id}}&display=popup&scopes=basic_info&redirect_uri={{protocol}}//{{host}}/auth/facebook/'
      },
      {
        name: 'linkedin',
        icon: 'in.png',
        url: 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id={{client_id}}&scope=r_fullprofile r_emailaddress&state={{protocol}}&redirect_uri={{protocol}}//{{host}}/auth/linkedin'
      },
    ]

    this.anyOauth = function () {
      return that.oauths.some(function (oauth) {
        return oauth.url
      })
    }


    this.loginDialog = function (type) {
      type = type || ''

      var defer = $q.defer(),
        onLocalStorageCallback = function () {
          if (localStorage.token !== undefined && localStorage.user !== undefined && localStorage.rolesHash !== undefined) {
            angular.element(window).off('storage', onLocalStorageCallback)
            eventBind = false
            defer.resolve({
              isMain: true,
              user: localStorage.user,
              rolesHash: localStorage.rolesHash
            })
          }else if (localStorage.error) {
            delete (localStorage.error)
            defer.reject({
              anonymous: true,
            })
          }
        },
        screenX = window.screenX || window.screenLeft,
        screenY = window.screenY || window.screenTop,
        outerWidth = window.outerWidth || document.body.clientWidth,
        outerHeight = window.outerHeight || (document.body.clientHeight - 22),
        width = 730,
        height = 610,
        left = parseInt(screenX + ((outerWidth - width) / 2), 10),
        top = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
        features = (
        'width=' + width +
          ',height=' + height +
          ',left=' + left +
          ',top=' + top
        ),
        newwindow = window.open('/sys/login?type=' + type, '_blank', features)

      newwindow.focus()

      if (eventBind === false) {
        eventBind = true
        angular.element(window).on('storage', onLocalStorageCallback)
      }

      return defer.promise
    }

    this.loginWith = function (provider) {
      var defer = $q.defer(),
        onLocalStorageCallback = function () {
          if (localStorage.token !== undefined && localStorage.user !== undefined && localStorage.rolesHash !== undefined) {
            angular.element(window).off('storage', onLocalStorageCallback)
            eventBind = false
            defer.resolve({
              isMain: true,
              user: localStorage.user,
              rolesHash: localStorage.rolesHash
            })
          }else if (localStorage.error) {
            delete (localStorage.error)
            defer.reject({
              anonymous: true,
            })
          }
        },
        screenX = window.screenX || window.screenLeft,
        screenY = window.screenY || window.screenTop,
        outerWidth = window.outerWidth || document.body.clientWidth,
        outerHeight = window.outerHeight || (document.body.clientHeight - 22),
        width = 700,
        height = 500,
        left = parseInt(screenX + ((outerWidth - width) / 2), 10),
        top = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
        features = (
        'width=' + width +
          ',height=' + height +
          ',left=' + left +
          ',top=' + top
        ),
        newwindow = null
      if (provider.code) {
        newwindow = window.open('/auth/email?hmac=' + provider.hmac + '&session=' + provider.session + '&code=' + provider.code, '_blank', features)
      } else {
        newwindow = window.open(that.oauths[provider].url, '_blank', features)
      }
      newwindow.focus()

      if (eventBind === false) {
        eventBind = true
        angular.element(window).on('storage', onLocalStorageCallback)
      }
      return defer.promise
    }



    this.startup = function () {
      var search = $location.search()
      if (search.use) {
        return $http.post('/api/user/use/' + search.use)
          .then(function (data) {
            data = data.data
            sessionStorage.rolesHash = data.rolesHash_
            sessionStorage.user = search.use
            sessionStorage.token = data.token
            return {
              user: search.use,
              rolesHash: sessionStorage.rolesHash,
              isMain: false
            }
          })
      }

      if (sessionStorage.token && sessionStorage.user && sessionStorage.rolesHash) {
        return $q.when({
          isMain: false,
          user: sessionStorage.user,
          rolesHash: sessionStorage.rolesHash
        })
      }

      if (localStorage.token && localStorage.user && localStorage.rolesHash) {
        return $q.when({
          isMain: true,
          user: localStorage.user,
          rolesHash: localStorage.rolesHash,
        })
      }
      delete (localStorage.token)
      delete (localStorage.user)
      delete (localStorage.rolesHash)
      delete (sessionStorage.user)
      delete (sessionStorage.rolesHash)
      delete (sessionStorage.token)
      var landed = !!sessionStorage.landed
      sessionStorage.landed = true
      return $q.reject({
        anonymous: true,
        landed: landed
      })
    }

    $http.get('/api/config/oauth')
      .success(function (data) {
        that.oauths.forEach(function (oauth) {
          if (!data.config[oauth.name]) {
            oauth.url = false
            return
          }
          oauth.url = oauth.url
            .replace(/{{protocol}}/g, window.location.protocol)
            .replace(/{{host}}/g, window.location.host)
            .replace(/{{client_id}}/g, data.config[oauth.name])
        })
      })

  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $rootScope) {
      return {
        'request': function (request) {
          if (localStorage.token && request.url.match(/^\/api/)) {
            request.headers = request.headers || {}
            request.params = request.params || {}
            request.headers['X-AUTH-TOKEN'] = localStorage.token
            request.headers['X-AUTH-AS'] = request.headers['X-AUTH-AS'] || sessionStorage.user
          }
          if(!request.url.match(/\/typeahead[\/?]/)){
            $rootScope.wait = true
          }
          return request
        },
        'responseError': function (response) {
          $rootScope.wait = false
          if (response.status === 401) {
            localStorage.clear()
            window.location = '/'
          }
          if (response.status === 502) {
            $rootScope.outOfService = true
          }          
          return $q.reject(response)
        },
        'response': function (response) {
          $rootScope.wait = false
          return response
        }
      }
    })
  })
