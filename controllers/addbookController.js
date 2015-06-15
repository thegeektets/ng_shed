function AddBookCtrl ($scope, $location, Restangular,$http,$rootScope) {
 $rootScope.addmanually = 'false';

$scope.manual = function(){
  console.log('switching to manual');

  $rootScope.addmanually = 'true';

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
  $scope.book.transaction = $scope.book.copies;

 /* if($rootScope.authService.currentUsertype() == 'admin'){

      $scope.book.librarytype = $rootScope.authService.currentTeam()+' Library';
  
  }
  else{
     $scope.book.librarytype = 'Personal Library';
  }
  */

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
      id: 'TeamLibrary',
      desc: 'Team Library'
      }, {
      id: 'PersonalLibrary',
      desc: 'Personal Library'
      }];
    $scope.save = function () {
        $scope.book.transaction = $scope.book.copies;

        Restangular.all('books').post($scope.book).then(function (book) {
            $location.path('/listbooks');
        });
    }
}
