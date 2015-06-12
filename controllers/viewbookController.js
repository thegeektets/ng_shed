function ViewBookCtrl($rootScope,$scope, $location, Restangular, book,$http){
  $scope.relatedbooks = Restangular.all("books").getList().$object;

	var original = book;
 	$scope.book = Restangular.copy(original);
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
    $scope.reviews = Restangular.all("reviews").getList().$object;
     $scope.review ={};
	$scope.isClean = function () {
		return angular.equals(original, $scope.book);
	}

	$scope.borrow = function(user,email){
     $scope.book.borrowedby = user;
     $scope.book.borrowedbyemail = email;
     $scope.book.status = 'borrowed';
     //$scope.book.push('borrowedby : '+user);

    	console.log('borrowedby :' + 	email);
		$scope.book.put().then(function () {
			$location.path('/viewbook/'+book._id.$oid);
		});
	
	};

	$scope.return = function(){
      $scope.book.status = 'available';
     $scope.book.borrowedby = '';
     $scope.book.borrowedbyemail = '';

    		$scope.book.put().then(function () {
			$location.path('/viewbook/'+book._id.$oid);
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