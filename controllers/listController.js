
function ListCtrl($scope, Restangular,$rootScope,$http) {
$scope.users =[];

  if($rootScope.authService.currentUsertype() == 'admin'){ 

   $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"invitedby":"'+$rootScope.authService.userId()+'"}',{cache:true}).success(function(data){
     $scope.people = data;

     console.log(data);
 });

        $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+$rootScope.authService.userId()+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',{cache:true}).success(function(data){ 
       $scope.users= angular.extend(data,$scope.people);

      console.log($scope.users );

     });

   

    

	//$scope.groups = Restangular.all("groups").getList().$object;
  }
  else{
      currentUsertype
  $http.get('https://api.mongolab.com/api/1/databases/shed_datahbase/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"invitedby":"'+$rootScope.authService.currentInvitedby()+'"}',{cache:true}).success(function(data){     $scope.people   = data; console.log(data);});
  $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+$rootScope.authService.currentInvitedby()+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',{cache:true}).success(function(data){ 
       $scope.users= angular.extend(data,$scope.people);

  });
};

}
