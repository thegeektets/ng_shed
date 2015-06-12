
function RegCtrl($scope, $location, Restangular) {

    

  
  $scope.save = function () {

    $scope.team.admin = $scope.user.username;
    
    $scope.user.user_type = 'admin';
  
    Restangular.all('users').post($scope.user).then(

      function (user) {
      Restangular.all('teams').post($scope.team).then(

      function (team) {
      $location.path('/list');
    });
    });
  }
}
