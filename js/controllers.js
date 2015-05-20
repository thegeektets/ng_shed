'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ShedController', function() {

  })

.controller('Controller', function($scope) {
        
    $scope.book={};
   	$scope.teamreferences= [{
           id: 'Branding',
           desc: 'Branding'
              }, {
           id: 'Digital',
           desc: 'Digital'
          }];
  	

    $scope.librarytypes= [{
      id: 'ArkLibrary',
      desc: 'Ark Library'
      }, {
      id: 'PersonalLibrary',
      desc: 'Personal Library'
      }];

    $scope.saveBook  = function(){
      if ($scope.myform.$valid)
        console.log('saving book');

      else
        console.log('Unable to save | Validation Error');

    }


});						