'use strict';

angular.module('crowdferenceApp')
.directive('userCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/userCard/index.html',
    replace:true,
    scope:{
      'user':'=',
    }
  }
})
