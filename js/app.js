// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'user',
  ['restangular','ngRoute'],  
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
  config(function ($routeProvider, RestangularProvider) {
        $routeProvider.
            when('/', {
                controller: ListCtrl,
                templateUrl: 'users.list.html'
            }).
            when('/edit/:userId', {
                controller: EditCtrl,
                templateUrl: 'users.detail.html',
                resolve: {
                    user: function (Restangular, $route) {
                        return Restangular.one('users', $route.current.params.userId).get();
                    },
                    groups: function (Restangular) {
                        return Restangular.all('groups').getList().$object;
                    }
                }
            }).
            when('/new', {
                controller: CreateCtrl,
                templateUrl: 'users.detail.html',
                resolve: {
                    groups: function (Restangular) {
                        return Restangular.all('groups').getList().$object;
                    }
                }
            }).when('/shed', {templateUrl: 'views/shed.html', controller: 'shedController'})
              .when('/add', {templateUrl: 'views/add.html', controller: 'addController'})
              .otherwise({redirectTo: '/shed'});

      RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/beorg-app/collections');
        RestangularProvider.setDefaultRequestParams({ apiKey: 'WB5ZDewHyirIssJSIylEHfljGaczWmYp' })
        RestangularProvider.setRestangularFields({
            id: '_id.$oid'
        });

        RestangularProvider.setRequestInterceptor(function (elem, operation, what) {

            if (operation === 'put') {
                elem._id = undefined;
                return elem;
            }
            return elem;
        })
  }]); 


function ListCtrl($scope, Restangular) {
    $scope.users = Restangular.all("users").getList().$object;
    $scope.groups = Restangular.all("groups").getList().$object;
}


function CreateCtrl($scope, $location, Restangular, groups) {
    $scope.groups = groups;

    $scope.save = function () {
        Restangular.all('users').post($scope.user).then(function (user) {
            $location.path('/list');
        });
    }
}
function AddBookCtrl ($scope, $location, Restangular) {
    
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
    $scope.save = function () {
        Restangular.all('books').post($scope.book).then(function (book) {
            $location.path('/listbooks');
        });
    }
}

function EditCtrl($scope, $location, Restangular, user, groups) {
    $scope.groups = groups;

    var original = user;
    $scope.user = Restangular.copy(original);

    $scope.isClean = function () {
        return angular.equals(original, $scope.user);
    }

    $scope.destroy = function () {
        original.remove().then(function () {
            $location.path('/list');
        });
    };

    $scope.save = function () {
        $scope.user.put().then(function () {
            $location.path('/');
        });
    };
}