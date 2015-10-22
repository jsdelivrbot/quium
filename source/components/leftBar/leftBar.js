'use strict'

angular.module('crowdferenceApp')
  .directive('leftBar', function () {
    return {
      templateUrl: 'components/leftBar/leftBar.html',
      restrict: 'E',
      replace: true,
      controller: function ($element, $swipe) {
        var canceled = false
        var origin = null
        var width = window.innerWidth
        var active = width < 850
        var left = 0
        var horizontal = false

        var resize = function () {
          width = window.innerWidth
          if (active && width > 850) {
            $element.css({left: 0})
          }
          active = width < 850
        }

        var cancel = function () {
          horizontal = false
          canceled = true
          origin = null
          $element.css({left: left})
        }

        $(window).resize(resize)
        $swipe.bind(angular.element(window.document), {

          start: function (coords, event) {
            if (!active) {
              return
            }
            horizontal = false
            canceled = false
            origin = coords
          },
          cancel: cancel,
          move: function (coords, event) {
            if (!active || canceled || !origin) {
              return
            }

            var total = coords.x - origin.x

            if (!horizontal && Math.abs(coords.y - origin.y) > Math.abs(total)) {
              return cancel()
            }
            horizontal = true

            var l = left + total
            if (l < -320) {
              l = -320
            }
            if (l > 0) {
              l = 0
            }
            $element.css({left: l})
          },
          end: function (coords, event) {
            if (!active || canceled) {
              return
            }
            var total = coords.x - origin.x

            if (left + total < -160) {
              left = -320
            } else {
              left = 0
            }
            cancel()
          }
        })
      }
    }
  })
