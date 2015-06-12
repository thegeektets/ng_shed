

function EditCtrl($scope, $location, Restangular, user) {
	
	var original = user;
	$scope.user = Restangular.copy(original);

	$scope.isClean = function () {
		return angular.equals(original, $scope.user);
	}

	$scope.destroy = function () {
		original.remove().then(function () {
			$location.path('/listusers');
		});
	};

	$scope.save = function () {
		$scope.user.put().then(function () {
			$location.path('/listusers');
		});
	};
}