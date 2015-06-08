
var shed = angular.module('shed', ['restangular', 'ngRoute','angularFileUpload']).
	config(function ($routeProvider, RestangularProvider) {
		$routeProvider.
			when('/', {
				controller: ListBookCtrl,
				templateUrl: 'books.list.html'
        
			}).
      when('/login', {
         templateUrl: 'users.login.html'

      }).
			when('/addbook', {
				controller: AddBookCtrl,
				templateUrl: 'books.add.html'
			}).
			when('/listbooks', {
				controller: ListBookCtrl,
				templateUrl: 'books.list.html'
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
				templateUrl: 'users.list.html'

			}).
			when('/edit/:userId', {
				controller: EditCtrl,
				templateUrl: 'users.detail.html',
				resolve: {
					user: function (Restangular, $route) {
						return Restangular.one('users', $route.current.params.userId).get();
					}
				}
			}).
			when('/editbook/:bookId', {
				controller: EditBookCtrl,
				templateUrl: 'books.add.html',
				resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.bookId).get();
					}
				}
			}).
			when('/new', {
				controller: CreateCtrl,
				templateUrl: 'users.detail.html',
				
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
        if ( next.templateUrl === "users.login.html") {
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
    function (Restangular,$rootScope,$http) {
        var currentUser = null;
        var authorized = false;

        // initMaybe it wasn't meant to work for mpm?ial state says we haven't logged in or out yet...
        // this tells us we are in public browsing
        var initialState = true;

        var userid = null;
        return {
            initialState:function () {
                return initialState;
            },
            login:function (name, password) {
                
                $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/users/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl').
      
             success(function(data) {
             $rootScope.users = data;
             // angular.forEach($rootScope.users, function(user){
                	for(i = $rootScope.users.length -1;i >= 0 ; i--){
                  		    user = $rootScope.users[i];
                			  if(user.username === name  && user.password === password){
                			  	   currentUser = name;
                			  	   email = user.email;
                			  	   userid = user._id.$oid;
                			  	    authorized = true;
                	   			   initialState = false;

                            console.log('logged in');
                            break;
                			  }
                			  else{
                			  		  authorized = false;
                               console.log('log in failed');
                			  }

                		}

      					
      					//});
        });
                 
                
            },
            logout:function () {
                currentUser = null;
                authorized = false;
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
            userId:function(){
            	 return userid;
            },

            authorized:function () {
                return authorized;
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




function ListCtrl($scope, Restangular) {
	$scope.users = Restangular.all("users").getList().$object;
	//$scope.groups = Restangular.all("groups").getList().$object;
}



function CreateCtrl($scope, $location, Restangular) {
	
	$scope.save = function () {
		Restangular.all('users').post($scope.user).then(function (user) {
			$location.path('/list');
		});
	}
}


function ListBookCtrl($scope, Restangular) {
	$scope.books = Restangular.all("books").getList().$object;
}

function AddBookCtrl ($scope, $location, Restangular,$http) {
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
     $scope.search + "&tomatoes=true&plot=full")
   .success(function(response){
    $scope.details = response;

  $scope.book.title = $scope.details.items['0'].volumeInfo.title;
  $scope.book.description = $scope.details.items['0'].volumeInfo.description;
  $scope.book.publisher = $scope.details.items['0'].volumeInfo.publisher;
  $scope.book.author = $scope.details.items['0'].volumeInfo.authors['0'];
  $scope.book.dateofpublication = $scope.details.items['0'].volumeInfo.publishedDate;
  $scope.book.pic = $scope.details.items['0'].volumeInfo.imageLinks.thumbnail;
  $scope.book.category = $scope.details.items['0'].volumeInfo.categories['0'];
          
  $scope.book.librarytype = 'Personal';


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


function EditBookCtrl($scope, $location, Restangular, book){
    
    

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

	$scope.destroy = function () {
		original.remove().then(function () {
			$location.path('/listbooks');
		});
	};

	$scope.save = function () {
		$scope.book.put().then(function () {
			$location.path('/listbooks');
		});
	};
}

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
