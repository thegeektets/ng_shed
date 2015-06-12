function AddBookCtrl ($scope, $location, Restangular,$http,$rootScope) {
  $scope.addmaunally = false;

$scope.manual = function(){
  $scope.addmaunally = true;

}

   var pendingTask;
 
$scope.change = function(){
  if(pendingTask) {
    clearTimeout(pendingTask);

  }
  pendingTask = setTimeout(fetch, 800);

  

};

function fetch() {
  $http.get("https://www.googleapis.com/books/v1/volumes?q=" + 
     $scope.search)
   .success(function(response){
    $scope.details = response;

  $scope.book.title = $scope.details.items['0'].volumeInfo.title;
  $scope.book.description = $scope.details.items['0'].volumeInfo.description;
  $scope.book.publisher = $scope.details.items['0'].volumeInfo.publisher;
  $scope.book.author = $scope.details.items['0'].volumeInfo.authors['0'];
  $scope.book.dateofpublication = $scope.details.items['0'].volumeInfo.publishedDate;
  $scope.book.pic = $scope.details.items['0'].volumeInfo.imageLinks.thumbnail;
  $scope.book.category = $scope.details.items['0'].volumeInfo.categories['0'];
  $scope.book.teamid = $rootScope.authService.teamId();
  if($rootScope.authService.currentUsertype() == 'admin'){

      $scope.book.librarytype = $rootScope.authService.currentTeam()+' Library';
  
  }
  else{
     $scope.book.librarytype = 'Personal Library';
  }
  

  });


}
$scope.update = function(movie){
  $scope.search = movie.Title;
  $scope.change();
};
$scope.select = function(){
  this.setSelectionRange(0, this.value.length);
}   
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