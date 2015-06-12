
var shed = angular.module('shed', ['restangular', 'ngRoute','angularFileUpload']).
	config(function ($routeProvider, RestangularProvider) {
		$routeProvider.
			when('/', {
				controller: ListBookCtrl,
				templateUrl: 'views/books.list.html'
        
			}).
         when('/borrowed', {
         controller:BrwCtrl,
         templateUrl: 'views/books.borrowed.html'

      }).
       when('/invite', {
         controller: InvCtrl,
         templateUrl: 'views/users.invite.html'

      }).
      when('/login', {
         templateUrl: 'views/users.login.html'

      }).
       when('/register', {
         controller: RegCtrl,
         templateUrl: 'views/users.signup.html'

      }).
      when('/registernew/:email/:invite', {
          controller: RegnwCtrl,
        templateUrl: 'views/users.detail.html'
      


      }).
			when('/addbook', {
				controller: AddBookCtrl,
				templateUrl: 'views/books.add.html'
			}).
			when('/listbooks', {
				controller: ListBookCtrl,
				templateUrl: 'views/books.list.html'
			}).
			when('/author/:book.author', {
				controller: AthrBookCtrl,
				templateUrl: 'book.view.html',
         resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.author).get();
					}


				}
			}).
			when('/viewbook/:bookId', {
				controller: ViewBookCtrl,
				templateUrl: 'book.view.html',
       
				resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.bookId).get();
					}

				}
			}).
				when('/listusers', {
				controller: ListCtrl,
				templateUrl: 'views/users.list.html'

			}).
			when('/edit/:userId', {
				controller: EditCtrl,
				templateUrl: 'views/users.detail.html',
				resolve: {
					user: function (Restangular, $route) {
						return Restangular.one('users', $route.current.params.userId).get();
					}
				}
			}).
			when('/editbook/:bookId', {
				controller: EditBookCtrl,
				templateUrl: 'views/books.add.html',
				resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.bookId).get();
					}
				}
			}).
			when('/new', {
				controller: CreateCtrl,
				templateUrl: 'views/users.detail.html',
				
			}).
			otherwise({redirectTo: '/'});



		RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/shed_database/collections');
		RestangularProvider.setDefaultRequestParams({ apiKey: 'Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl' })
		RestangularProvider.setRestangularFields({
			id: '_id.$oid'
		});

		RestangularProvider.setRequestInterceptor(function (elem, operation, what) {

			if (operation === 'put') {
				elem._id = undefined;
				return elem;
			}
			return elem;
		})
	}).
  run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if (!$rootScope.authService.authorized()) {
          console.log('login required');
        if ( next.templateUrl === "users.login.html" || next.templateUrl === "users.signup.html"|| next.templateUrl === "users.detail.html") {
        } else {
          $location.path("/login");
        }
      }
    });
  });
	



  

	shed.run(function ($rootScope, $location, $http,  $timeout, AuthService, RESTService,Restangular) {


    // *****
    // Eager load some data using simple REST client
    // *****

    $rootScope.restService = RESTService;

    // async load constants
    $rootScope.constants = [];
    /*$rootScope.restService.get('data/constants.json', function (data) {
            $rootScope.constants = data[0];
        }
    );
    */
    // async load data do be used in table (playgound grid widget)
    $rootScope.listData = [];
    /*$rootScope.restService.get('data/generic-list.json', function (data) {
            $rootScope.listData = data;
        }
    );
    */
    // *****
    // Initialize authentication
    // *****
    $rootScope.authService = AuthService;

    // text input for login/password (only)
    //$rootScope.loginInput = 'user@gmail.com';
    //$login = $rootScope.login;

   	
    $rootScope.$watch('authService.authorized()', function () {

        // if never logged in, do nothing (otherwise bookmarks fail)
        if ($rootScope.authService.initialState()) {
            // we are public browsing
            return;
        }

        // instantiate and initialize an auth notification manager
        $rootScope.authNotifier = new NotificationManager($rootScope);

        // when user logs in, redirect to home
        if ($rootScope.authService.authorized()) {
            $location.path("/");
            $rootScope.authNotifier.notify('information', 'Welcome ' + $rootScope.authService.currentUser() + "!");
        }

        // when user logs out, redirect to home
        if (!$rootScope.authService.authorized()) {
            $location.path("/");
            $rootScope.authNotifier.notify('information', 'Thanks for visiting.  You have been signed out.');
        }

    }, true);



   
});

// simple stub that could use a lot of work...
shed.factory('RESTService',
    function ($http) {
        return {
            get:function (url, callback) {
                return $http({method:'GET', url:url}).
                    success(function (data, status, headers, config) {
                        callback(data);
                        //console.log(data.json);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("failed to retrieve data");
                    });
            }
        };
    }
);


// simple auth service that can use a lot of work... 
shed.factory('AuthService',
    function (Restangular,$rootScope,$http,$location) {
        var currentUser = null;
        var authorized = false;
        var initialState = true;
        var userid = null;
        var user_type = null;
        var currentTeam = null;
        var invitedby = null;
        var teamId = null;


        return {
            initialState:function () {
                return initialState;
            },
            login:function (name, password) {
                
                $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl').
      
             success(function(data) {
             $rootScope.users = data;
                     
             


                	for(i = $rootScope.users.length -1;i >= 0 ; i--){
                  		    user = $rootScope.users[i];
                			  if(user.username === name  && user.password === password){
                			  	   currentUser = name;
                			  	   email = user.email;
                			  	   userid = user._id.$oid;
                			  	    authorized = true;
                	   			   initialState = false;
                             user_type = user.user_type;
                             invitedby = user.invitedby;
                             console.log('logged in');
                            break;
                			  }
                			  else{
                			  		  authorized = false;
                               console.log('log in failed');
                			  }

                		}
              if(authorized == true){
                if(user_type == 'admin'){ 
      					$http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/teams/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl')
                .success(function(data){
                    $rootScope.teams = data;
                    for(i = $rootScope.teams.length -1;i >= 0 ; i--){
                          team = $rootScope.teams[i];
                        if(currentUser == team.admin  ){
                              teamId = team._id.$oid;
                              currentTeam = team.name;
                              /*
                                $rootScope.user = $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+userid+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl');
                                $rootScope.user.teamid = team._id.$oid;
                                $http.put('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+userid+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',$rootScope.user);
                                */
                              
                               break; 

                        }
                        

                    }
                });
              }else{
      			     $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/teams/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl')
                .success(function(data){
                    $rootScope.teams = data;
                  $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+invitedby+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl').success(function(data){

                        admin = data;

                       for(i = $rootScope.teams.length -1;i >= 0 ; i--){
                          team = $rootScope.teams[i];
                        if(admin.username == team.admin  ){
                             teamId = team._id.$oid;
                              currentTeam = team.name;
                              /*
                                $rootScope.user = $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+userid+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl');
                                $rootScope.user.teamid = team._id.$oid;
                                $http.put('https://api.mongolab.com/api/1/databases/shed_database/collections/users/'+userid+'/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl',$rootScope.user);
                               */
                              
                              break;
                        }
                        

                    }
                  });

                  
   
                });
             	    	
              }
            }
        
        });
                 
                
            },
            logout:function () {
             
                currentUser = null;
                authorized = false;
                $location.path("/login");
            },
            isLoggedIn:function () {
                return authorized;
            },
            currentUser:function () {
                return currentUser;
            },
            currentEmail:function(){
            	 return email;
            },
            currentUsertype:function(){
              return user_type;
            },
            currentInvitedby:function(){
              return invitedby;
            },
            userId:function(){
            	 return userid;
            },

            authorized:function () {
                return authorized;
            },
            currentTeam:function(){
                return currentTeam;
            },
            teamId:function(){
                return teamId;
            },
            
            isAuthenticated: function() {
                
              if (authorized) {
                  return true;
              }
              else{
                 return false;
              }
            }
     


        };
    }
);
var compareTo = function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  };

shed.directive("compareTo", compareTo);

FileUploadCtrl.$inject = ['$scope']
function FileUploadCtrl(scope) {
    

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      scope.progressVisible = false
      });
    };

    scope.uploadFile = function() {
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "upload.php")
        scope.progressVisible = true
        xhr.send(fd)
    }

    function uploadProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
}



