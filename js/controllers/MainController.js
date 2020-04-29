app.controller('MainController', function($scope, $http) {

    $scope.title = "Find That Recipe";
    $scope.isLoggedIn = false;
    $scope.isGuest = false;
    $scope.sidebarActive = false;
    

    $scope.isRecipeDetails = false;
    $scope.isProfileDetails = false;

    $scope.optionSelected = 0;


    $scope.search = {
        text: ""
    };

    $scope.loginInfo = {
        username: "",
        password: ""
    }
    $scope.user = {
        userId: "",
        username: ""
    }
    $scope.login = function() {
        $scope.user.userId = null;
        $scope.user.username = null;
        //console.log($scope.loginInfo);
        $http({
            method: "GET",
            url: baseUrl + "/login/" + $scope.loginInfo.username + "/" + $scope.loginInfo.password
        }).then(function(response) {
            console.log(response.data);
            if (response.data.length != 0) {
                $scope.isGuest = false;
                $scope.isLoggedIn = true;
                
                $scope.user.userId = response.data[0].UserId;
                $scope.user.username = response.data[0].Username;
            } else {
                $scope.createAccount();
            }
        }, function(error) {

        })
    }

    $scope.createAccount = function() {
        console.log($scope.loginInfo);
        $http({
            method: "GET",
            url: baseUrl + "/createAccount/" + $scope.loginInfo.username + "/" + $scope.loginInfo.password
        }).then(function(response) {
            //$scope.isGuest = false;
            //$scope.isLoggedIn = true;
            
            $scope.login();
        }, function(error) {

        })
    }


    $scope.userReviews = [];
    $scope.profileClicked = function() {
        $scope.sidebarActive = !$scope.sidebarActive;

        $http({
            method: "GET",
            url: baseUrl + "/getUserReviews/" + $scope.user.userId
        }).then(function(response) {
            $scope.userReviews = response.data;
            $scope.isProfileDetails = true;
            $scope.isRecipeDetails = false;
        }, function(error) {

        })
    }

    var baseUrl = "http://localhost:3100";
    $scope.recipes = [];
    $scope.searchRecipes = function() {

        $http({
            method: "GET",
            url: baseUrl + "/getRecipeNames/" + $scope.search.text
        }).then(function(response) {
            //console.log(response.data);
            $scope.recipes = response.data;
        }, function(error) {  
            console.error(error);
        })

    }

    $scope.recipeDetails = [];
    $scope.getRecipeDetails = function(recipeId) {
        //console.log(recipeId);
        $scope.sidebarActive = !$scope.sidebarActive;

        $http({
            method: "GET",
            url: baseUrl + "/getRecipeDetails/" + recipeId
        }).then(function(response) {
            $scope.recipeDetails = response.data;
            $scope.isProfileDetails = false;
            $scope.isRecipeDetails = true;
        }, function(error) {
            console.error(error);
        })
    }
    $scope.splitIngredients = function(ingredients) {
        return ingredients.split(",");
    }
    $scope.splitDirections = function(directions) {
        return directions.split(".");
    }

    $scope.recipeReviews = [];
    $scope.getRecipeReviews = function(recipeId) {
        $http({
            method: "GET",
            url: baseUrl + "/getReviews/" + recipeId
        }).then(function(response) {
            console.log(response.data);
            $scope.recipeReviews = response.data;
        }, function(error) {

        })
    }


    $scope.review = {
        score: null,
        recipeId: null,
        userId: null
    };
    $scope.addReview = function(recipeId) {
        $http({
            method: "GET",
            url: baseUrl + "/addReview/" + $scope.review.score + "/" + $scope.user.userId + '/' + recipeId
        }).then(function(response) {
            $scope.review.score = null
        })
    }
});