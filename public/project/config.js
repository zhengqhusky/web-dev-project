(function () {
    angular
        .module("RestaurantApp")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/search/:keyword", {
                templateUrl: "views/search/search.view.client.html",
                controller: "SearchController",
                controllerAs: "model"
            })
            .when("/restaurant", {
                templateUrl: "views/restaurant/restaurant-list.view.client.html",
                controller: "RestaurantListController",
                controllerAs: "model"
            })
            .when("/restaurant/:rid", {
                templateUrl: "views/restaurant/restaurant.view.client.html",
                controller: "RestaurantController",
                controllerAs: "model"
            })
            .when("/restaurant/:rid/review/:uid", {
                templateUrl: "views/review/review-new.view.client.html",
                controller: "NewReviewController",
                controllerAs: "model"
            })
            .when("/user/:id", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/user/:id/review", {
                templateUrl: "views/review/review-list.view.client.html",
                controller: "ReviewListController",
                controllerAs: "model"
            })
            .when("/user/:id/review/:rid", {
                templateUrl: "views/review/review-edit.view.client.html",
                controller: "EditReviewController",
                controllerAs: "model"
            })
            .when("/user/:id/friend", {
                templateUrl: "views/friend/friend.view.client.html",
                controller: "FriendController",
                controllerAs: "model"
            })
            .when("/user/:id/favorite/:lid", {
                templateUrl: "views/favorite/favorite.view.client.html",
                controller: "FavoriteController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/"
            });
    }
})();