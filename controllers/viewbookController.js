function ViewBookCtrl($rootScope,$scope, $location, Restangular, book,$http){
  
  $scope.relatedbooks = Restangular.all("books").getList().$object;
       $scope.borrowed = {};
  


	var original = book;
 	$scope.book = Restangular.copy(original);
  var transaction = $scope.book.transaction;

    $scope.teamreferences= [{
           id: 'Branding',
           desc: 'Branding'
              }, {
           id: 'Digital',
           desc: 'Digital'
          }];
    
  

    $scope.librarytypes= [{
      id: 'TeamLibrary',
      desc: 'Team Library'
      }, {
      id: 'PersonalLibrary',
      desc: 'Personal Library'
      }];
    $scope.reviews = Restangular.all("reviews").getList().$object;
     $scope.review ={};
	$scope.isClean = function () {
		return angular.equals(original, $scope.book);
	}

	$scope.borrow = function(user,email){

     $scope.borrowed.borrowdate = new Date();
     $scope.borrowed.bookid  = book._id.$oid;
     $scope.borrowed.userid = $rootScope.authService.userId();
     $scope.borrowed.bookname = $scope.book.title;
     $scope.borrowed.username = user;
     $scope.borrowed.teamid = $scope.book.teamid;
     $scope.borrowed.usermail = email;

     $scope.book.borrowedby = user;
     $scope.book.borrowedbyemail = email;
     $scope.book.status = 'borrowed';
     $scope.book.transaction = (transaction - 1 );

     //$scope.book.push('borrowedby : '+user);
     console.log('borrowedby :' + 	email);
		 console.log('borrow :' +  $scope.borrowed);
   
    $scope.book.put().then(function () {

       Restangular.all('borrowed').post($scope.borrowed).then(function () {
           
            $location.path('/viewbook/'+book._id.$oid);

        });
		
		});
	
	};

	$scope.return = function(){
     $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/borrowed/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"bookid":"'+book._id.$oid+'","userid":"'+$rootScope.authService.userId()+'"}')
                .success(function(data){
                 if(data.length > 0){
                 $scope.borrowed = data[data.length-1];
               }
               else{
                  $scope.borrowed = data;
               
               }
                 console.log($scope.borrowed);
               


        $http({
          url :'https://api.mongolab.com/api/1/databases/shed_database/collections/borrowed/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"bookid":"'+book._id.$oid+'","userid":"'+$rootScope.authService.userId()+'"}',

          method :"PUT",
          data :{
          "borrowdate":$scope.borrowed.borrowdate ,
          "bookid":$scope.borrowed.bookid,
          "userid":$scope.borrowed.userid,
          "bookname":$scope.borrowed.bookname,
          "username":$scope.borrowed.username,
          "teamid":$scope.borrowed.teamid,
           "usermail":$scope.borrowed.usermail,
          "returndate":new Date()}
        }).success(function(data, status) {
           
   
              
            $scope.book.status = 'available';
             $scope.book.borrowedby = '';
             $scope.book.borrowedbyemail = '';
              $scope.book.transaction = ($scope.book.transaction + 1 );
           

              $scope.book.put().then(function () {
            $location.path('/viewbook/'+book._id.$oid);
    });
              
              })

                });

     

	
	};

	$scope.reviewbook= function(user){
     $scope.review.bookid = book._id.$oid;
     $scope.review.user = user;
     //$scope.review.comment = $rootScope.review.comment; 
       console.log($scope.review.comment);
       
      console.log(user);
      console.log(book._id.$oid);

      Restangular.all('reviews').post($scope.review).then(function (  ) {
     // $scope.reviews.splice($scope.review.user, $scope.review.comment);
   		$location.path('/viewbook/'+book._id.$oid);
		});
	
	};
}