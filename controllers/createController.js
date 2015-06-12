
function CreateCtrl($scope, $location, Restangular) {
	
	$scope.save = function () {
		Restangular.all('users').post($scope.user).then(function (user) {
			$location.path('/list');
		});
	}
}
