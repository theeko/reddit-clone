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
            controller: 'postsCtrl',
            resolve: {
              post: ["$stateParams","posts", function(posts, $stateParams){
                return posts.get($stateParams.id);
              }]
            }
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
     posts.upvote(post);
   };
}]);

app.controller("postsCtrl", ["post", "$stateParams", "$scope", "posts", function($scope, posts, post, $stateParams){
  $scope.post = post;
  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };
  $scope.addComment = function(){
    if($scope.body === ""){ return;}
    posts.addComment(post._id, {
      body: $scope.body,
      author: "user"
    }).success(function (comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = "";
  };
}]);

app.factory("posts", ["$http",function($http){
  
  var o = { posts: [] };
  
  o.getAll = function(){
    return $http.get("/posts").success(function(data){
      angular.copy(data, o.posts); //deep copy of object-array/source-destiny
    });
  };
  
  o.create = function(post){
    return $http.post("/posts"+ post).success(function(data){
      o.posts.push(data);
    });
  };
  
  o.upvote = function(post){
    return $http("/posts/" + post._id + "/upvote")
      .success(function(data){
        post.upvotes += 1;
      });
  };
  
  o.get = function (id) {
    return $http("/posts/" + id).then(function(res){
      return res.data;
    });
  };
  
  o.addComment = function(id, comment){
    return $http.post("/posts" + id + "/comments/" + comment);
  };
  
  o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
      .success(function(data){
        comment.upvotes += 1;
      });
  };
  
  return o;
  
}]);

