'use strict';

angular.module('crowdferenceApp')
.directive('typeaheadSearch', function() {
  return {
    require: ['ngModel'],
    restrict: 'A',
    scope:{
      'typeaheadSearch':'='
    },
    link: function(scope, element, attr, ctrls) {
      if (scope.typeaheadSearch) {
        scope.typeaheadSearch.callback = function(value){
          ctrls[0].$setViewValue(value);
          return value;
        };
      }
    }
  };
})

.controller('inlineQuestionSearchCtrl', function ($scope, $modalInstance, $http, Area, Question, question) {

  $scope.question = question;
  $scope.Area = Area;

  $scope.status = 'searching';
  
  $http.get('/api/search/' + question.target._id + '/all/target',{params:{topic:question.short}})
  .success(function(data){
    $scope.status = 'done';
    if(data.questions.length===0){
      $modalInstance.close();
    }
    
    $scope.questions = data.questions;
  })
  .error(function(){
    $modalInstance.close();
  });

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.directive('inlineQuestion', function () {
  var shortMaxLength    = 200;
  var shortMinLength    = 20;
  return {
    templateUrl: 'components/inlineQuestion/inlineQuestion.html',
    restrict: 'E',
    replace:true,
    scope:{},
    controller: function($q, $scope, $http, $location, $element, $timeout, $modal, User, markdown, Area){

      $scope.$watch(function(){
        return User.view._id
      }, function () {
        if (User.view._id) {
          $scope.question.target = User.view
        }
      })
      
      $scope.typesearch = {};
      $scope.shortMaxLength = shortMaxLength;
      $scope.shortMinLength = shortMinLength;
      $scope.isLogged = User.isLogged;
      $scope.markdown = markdown;
      $scope.question = {
        short:''
      };
      $scope.Area = Area.current;
      $scope.shortActive = true;
      $scope.updateTargets = function(){
        $http.get('/api/area/'+Area.current.url+'/targets/typeahead?q=')
          .then(function(data){
            $scope.targets = data.data.targets;
          });
        };

      $scope.getSuggestions = function(topic){
        if(topic.match(/^ .*/)){
          return $http.get('/auth/search?q='+topic)
          .then(function(data){
            if(data.data.users.length){
            data.data.users.forEach(function(user){
              user.shortExternalUrl = user.externalUrl.replace(/^http(s?):\/\/(w{3}\.)?/,'').replace(/^mailto:/,'');
            });

            return data.data.users;
            }else{
              return [{notFound:true}];
            }
          },function(){
            return [{notFound:true}];
          });
        }else if(topic){
          return $http.get('/api/area/'+Area.current.url+'/targets/typeahead?q='+topic)
          .then(function(data){
            // ~ data.data.targets.push({search:topic});
            return data.data.targets;
          });
        }else{
          return [];
        }
      };
      $scope.select = function(target){
        if(target.search){
          return $scope.typesearch.callback(' '+target.search);
        }else if(target.notFound){
          return '';
        }else{
          $scope.question.target = target;
          return '';
        }
      };
      $scope.chooseAgain = function(){
        $scope.question.target = {};
        $timeout(function(){
          $element.children('input').focus();
        });
      };
      $scope.crowdIt = function(){
        if(!test()){
          return;
        }
        var modalInstance = $modal.open({
          templateUrl: 'components/inlineQuestion/search.html',
          controller: 'inlineQuestionSearchCtrl',
          size: 'lg',
          resolve: {
            question: function () {
              return $scope.question;
            }
          }
        });

        modalInstance.result.then(function () {
          if(!$scope.question.target._id){
            createUserAndCrowdIt();
          }else{
            crowdIt();
          }
        }, function () {
          $scope.question = {
            short:''
          };
        });

      };
      var test = function(){
        var error=function(){
          $scope.error = true;
          return false;
        };



        if($scope.question.short === ''){
          return error();
        }

        // ~ if($scope.question.short.length   > shortMaxLength ){
          // ~ return error();
        // ~ }
        // ~ if($scope.question.short.length   < shortMinLength ){
          // ~ return error();
        // ~ }

        $scope.error = false;
        return true;
      },
      createUserAndCrowdIt = function(){
        $http.put('/auth/'+$scope.question.target.source, {
          uid:$scope.question.target.id+''
        }).success(function(data){
          $scope.question.target = {
            _id:data.user._id
          };
          crowdIt();
        });
      },
      crowdIt = function(){
        User.$http.post('/api/question/' + Area.current._id + '/' +$scope.question.target._id,  {question: {short: $scope.question.short}}).then(function(response){
          $location.url('/question/'+response.data._id);
        }).catch(function(){
          window.alert('algo ha salido mal');
        });
      };
    }
  };
});

