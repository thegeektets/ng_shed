

function AthrBookCtrl($scope, $location, Restangular, book){

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
	$scope.isClean = function () {
		return angular.equals(original, $scope.book);
	}

	

	$scope.save = function () {
		$scope.book.put().then(function () {
			$location.path('/listbooks');
		});
	};
}
