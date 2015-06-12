
function ListBookCtrl($scope, $location, Restangular,$rootScope,$http) {

$scope.books = {};

   if($rootScope.authService.currentUsertype() == 'admin'){ 
                
                $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/teams/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',{cache:true})
                .success(function(data){
                    $rootScope.teams = data;
                    for(i = $rootScope.teams.length -1;i >= 0 ; i--){
                         team = $rootScope.teams[i];
                        if($rootScope.authService.currentUser() == team.admin  ){
                           
                           $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/books/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"teamid":"'+team._id.$oid+'"}',{cache:true}).success(function(data){
                              $scope.books = data;
                               console.log($scope.books);
                           });   
                               
                               break; 

                        }
                        

                    }
                });
              }else{
                 $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/teams/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',{cache:true})
                .success(function(data){
                    $rootScope.teams = data;
                       $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+$rootScope.authService.currentInvitedby()+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',{cache:true}).success(function(data){
                            admin = data;
                               for(i = $rootScope.teams.length -1;i >= 0 ; i--){
                          team = $rootScope.teams[i];
                        if(admin.username == team.admin  ){
                                   
                           $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/books/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"teamid":"'+team._id.$oid+'"}',{cache:true}).success(function(data){
                              $scope.books = data;
                               console.log($scope.books);
                           });   
                                           
                              break;
                        }
                        

                    }
                       });
                  
                 
                });
                    
              }


  
}
