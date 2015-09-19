'use strict'

angular.module('crowdferenceApp')
  .service('$popup', function ($rootScope, $compile, $timeout) {
    var at = function (x, y) {
      var popup = this.popup
      var config = this.config
      $timeout(function () {
        var elementOffsetx = config.element[0].getBoundingClientRect().left
        var elementOffsety = config.element[0].getBoundingClientRect().top
        var offsetx = 25
        var offsety = 25
        var reverse = (angular.element(window).width() < popup.outerWidth() + x)
        var top = (angular.element(window).height() < popup.outerHeight() + y - angular.element(window).scrollTop())

        if (reverse) {
          x = x - elementOffsetx - popup.outerWidth() + offsetx
        }else {
          x = x - elementOffsetx - offsetx
        }
        if (top) {
          y = y - elementOffsety - popup.outerHeight() - angular.element(window).scrollTop() + offsety
        }else {
          y = y - elementOffsety - angular.element(window).scrollTop() - offsety
        }
        popup.css({left: x + 'px', top: y + 'px'})
      })
    }
    var defaultPopup = {
      template: '<div></div>',
      parent: $rootScope,
      scope: {},
      element: angular.element(window.document.body)
    }
    var main = function (config) {
      config = angular.extend({}, defaultPopup, config)

      var scope = config.parent.$new(false)
      angular.extend(scope, config.scope)

      var popup = $compile('<div mouseleave-delayed="$close()" class="popup"></div>')(scope)
      var element = $compile(config.template)(scope)
      if (config.x && config.y) {
        at.call({popup: popup, config: config}, config.x, config.y)
      }

      scope.$close = function () {
        popup.remove()
        scope.$destroy()
      }
      config.element.append(popup)
      popup.append(element)

      return {
        popup: popup,
        element: element,
        close: scope.close,
        at: at.bind({popup: popup, config: config})
      }
    }
    return main
  })
