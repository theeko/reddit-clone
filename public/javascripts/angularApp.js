var app = angular.module('redditClone', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', 
      function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'mainCtrl',
            resolve: {
              postPromise: ["posts", function(posts){
                return posts.getAll();
              }]
            }
          })
          .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'postsCtrl'
          });
            
        $urlRouterProvider.otherwise('home');
      }
  ]);
  

app.controller("mainCtrl", ["$scope", "posts", function($scope, posts){
  $scope.posts = posts.posts; //binding returned data to scope for usage.changes will be reflected to factory.
   
   $scope.addPost = function(){
     if(!!$scope.title == false) { return; }
     $scope.posts.push({
       title: $scope.title, 
       link: $scope.link
     });
     $scope.title = "";
     $scope.link = "";
   };
   
   $scope.incrementUpvotes = function(post){
     post.upvotes += 1;
   };
}]);

app.controller("postsCtrl", ["$scope", "posts", "$stateParams", function($scope, posts, $stateParams){
  $scope.post = posts.posts[$stateParams.id];
  $scope.addComment = function(){
    if($scope.body === ""){ return;}
    $scope.post.comments.push({
      body: $scope.body,
      author: "user",
      upvotes: 0
    });
    $scope.body = "";
  };
}]);

app.factory("posts", ["$http",function($http){
  
  var o = {
    posts: []
  };
  
  o.getAll = function(){
    return $http.get("/posts").success(function(data){
      angular.copy(data, o.posts); //deep copy of object-array/source-destiny
    });
  };
  
  o.create = function(post){
    $http.post("posts", post).success(function(data){
      o.posts.push(data);
    });
  };
  
  o.upvote =
  
  return o;
  
}]);

