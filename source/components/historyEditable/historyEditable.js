'use strict'

angular.module('crowdferenceApp')
  .directive('historyEditable', function (User, $compile, $timeout) {
    return {
      templateUrl: 'components/historyEditable/historyEditable.html',
      restrict: 'E',
      scope: {
        user: '=',
        history: '=',
        what: '@',
        save: '&',
        render: '&?',
        hideBar: '@',
        controls: '=?',
        current: '=?'
      },
      controller: function ($scope, $attrs, $element) {

        var max = $scope.history.length - 1
        var index = max

        var controls = {
          editing: false,
          edit: function () {
            controls.editing = {
              value: $scope.current[$scope.what]
            }
          },
          cancel: function () {
            controls.editing = false
          },
          ok: function () {
            $scope.save({$value: controls.editing.value})
            .then(function () {
              var edit = {
                timestamp: Date.now()
              }
              edit[$scope.what] = controls.editing.value
              $scope.history.push(edit)
              controls.editing = false
              max += 1
              controls.show(max)
            })
            .catch(controls.cancel)
          },
          next: function () {
            controls.show(index + 1)
          },
          prev: function () {
            controls.show(index - 1)
          },
          hasnext: function () {
            return index < max
          },
          hasprev: function () {
            return index > 0
          },
          show: function (i) {
            index = i
            $scope.current = $scope.history[index]
            if (controls.renderize) {
              controls.renderize()
            }
          }
        }

        if ($attrs.render) {
          controls.renderize = function () {
            var render = $scope.render({$content: $scope.current[$scope.what]})
            $element.find('.historyview').empty().append($compile(render.html)(render.$scope || $scope))
          }
          $timeout(controls.renderize)
        }

        controls.show(max)

        $scope.controls = controls

        if (max === -1) {
          controls.editing = {value: ''}
        }
      }
    }
  })
