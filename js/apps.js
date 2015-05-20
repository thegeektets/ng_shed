'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).


config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shed', {templateUrl: 'views/shed.html', controller: 'ShedController'});
  $routeProvider.when('/add', {templateUrl: 'views/add.html', controller: 'AddController'});
  $routeProvider.otherwise({redirectTo: '/shed'});
}]);
