
function BrwCtrl($scope, $location, Restangular,$rootScope,$http) {

$scope.books = Restangular.all("borrowed").getList().$object;



  
}