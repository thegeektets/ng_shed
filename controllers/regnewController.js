
function RegnwCtrl($scope, $location, Restangular,$http, $route){
   


           


            $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"email":"'+$route.current.params.email+'","invitedby":"'+$route.current.params.invite+'"}')
                .success(function(data){
                 
                 $scope.user = data;

                });
    

    $scope.save = function () {
         
        $http({
          url :'https://api.mongolab.com/api/1/databases/shed_database/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"email":"'+$route.current.params.email+'","invitedby":"'+$route.current.params.invite+'"}',

          method :"PUT",
          data :{"password":$scope.user.password,"username":$scope.user.username,"invitedby":$route.current.params.invite,"email":$route.current.params.email,"user_type":"user" }
        }).success(function(data, status) {
           
   
      $location.path('/login');
    })
  };
   
}
