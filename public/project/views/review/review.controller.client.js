(function () {
    angular
        .module("RestaurantApp")
        .controller("ReviewListController", ReviewListController)
        .controller("NewReviewController", NewReviewController)
        .controller("EditReviewController", EditReviewController)
        .directive("repeatEnd", repeatEnd);

    function repeatEnd($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var values = attrs.repeatEnd.split(", ");
                    var reviewId = values[0];
                    var rate = values[1];
                    var starId = reviewId+" star-"+rate;
                    document.getElementById(starId).checked = true;
                }, 0)
            }
        }
    }
    
    function ReviewListController($routeParams, ReviewService, RestaurantService, $timeout) {
        var vm = this;
        var doneReviews = 0;
        var reviewIdx = 0;
        vm.userId = $routeParams['id'];
        vm.searchRestaurant = searchRestaurant;
        function searchRestaurant(keyword) {
            if (!keyword) {
            } else {
                $location.url("/search/" + keyword);
            }
        }

        function init() {
            var reviews = [];
            ReviewService
                .findAllReviewsForUser(vm.userId)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        vm.alert = error.body;
                    }
                )
                .then(
                    function (reviews) {
                        var numReviews = reviews.length;
                        for (var i in reviews) {
                            RestaurantService
                                .findRestaurantById(reviews[i]._restaurant)
                                .then(
                                    function (response) {
                                        var restaurant = response.data;
                                        var review = reviews[reviewIdx];
                                        reviewIdx += 1;
                                        review.restaurant = restaurant;
                                        return [restaurant, numReviews];
                                    },
                                    function (error) {
                                        console.log('error', error)
                                    }
                                )
                                .then(
                                    function (values) {
                                        var numReviews = values[1];
                                        doneReviews += 1;
                                        if (doneReviews === numReviews) {
                                            vm.reviews = reviews;
                                        }
                                    },
                                    function (error) {
                                        console.log(error, 'error');
                                    }
                                )
                        }
                    }
                )
        }
        init();

        function addReview() {
            var review = {
                _user: vm.userId,
                rate: 3,
                review: "Average",
                _restaurant: "576c7347acc6a5881e938847"
            };
            ReviewService
                .createReviewForUser(vm.userId, review);
        }
        //addReview();
    }
    
    function NewReviewController($routeParams, ReviewService, UserService, RestaurantService) {
        var vm = this;

        vm.createReview = createReview;
        vm.cancel = cancel;

        vm.restaurantId = $routeParams['rid'];
        vm.userId = $routeParams['uid'];
        vm.searchRestaurant = searchRestaurant;
        function searchRestaurant(keyword) {
            if (!keyword) {
            } else {
                $location.url("/search/" + keyword);
            }
        }
        vm.review = {
            _restaurant: vm.restaurantId
        };

        function init() {
            RestaurantService
                .findRestaurantById(vm.restaurantId)
                .then(
                    function (response) {
                        vm.restaurant = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    }
                );
            UserService
                .findUserById(vm.userId)
                .then(
                    function (response) {
                        vm.user = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    }
                )
        }
        init();

        function createReview() {
            var stars = document.getElementsByName('star');
            for (var i in stars) {
                if (stars[i].checked) {
                    vm.review.rate = parseInt(stars[i].value);
                }
            }

            var review = document.getElementById('review').value;
            if (review) {
                vm.review.review = review;
            }

            if (! (1<=vm.review.rate && vm.review.rate<=5)) {
                vm.alert = 'Please enter rating'
            } else {
                ReviewService
                    .createReviewForUser(vm.userId, vm.review)
                    .then(
                        function (response) {
                            window.history.back();
                        },
                        function (error) {
                            vm.alert = error.data;
                        }
                    )
            }
        }

        function cancel() {
            console.log(window.history);
            window.history.back();
        }
    }
    
    function EditReviewController($routeParams, ReviewService, RestaurantService, UserService) {
        var vm = this;
        
        vm.updateReview = updateReview;
        vm.deleteReview = deleteReview;
        vm.searchRestaurant = searchRestaurant;
        function searchRestaurant(keyword) {
            if (!keyword) {
            } else {
                $location.url("/search/" + keyword);
            }
        }
        vm.userId = $routeParams['id'];
        vm.reviewId = $routeParams['rid'];
        
        function init() {
            UserService
                .findUserById(vm.userId)
                .then(
                    function (response) {
                        vm.user = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    }
                );
            ReviewService
                .findReviewById(vm.reviewId)
                .then(
                    function (response) {
                        vm.review = response.data;
                        var stars = document.getElementsByName('star');
                        for (var i in stars) {
                            if (parseInt(stars[i].value) === vm.review.rate) {
                                stars[i].checked = true;
                            }
                        }
                        var textarea = document.getElementById('review');

                        return vm.review._restaurant;
                    },
                    function (error) {
                        vm.alert = error.body;
                    }
                )
                .then(
                    function (restaurantId) {
                        RestaurantService
                            .findRestaurantById(restaurantId)
                            .then(
                                function (response) {
                                    vm.restaurant = response.data;
                                }
                            )
                    }
                )
        }
        init();
        
        function updateReview() {
            var stars = document.getElementsByName('star');
            for (var i in stars) {
                if (stars[i].checked) {
                    vm.review.rate = parseInt(stars[i].value);
                }
            }
            ReviewService
                .updateReview(vm.reviewId, vm.review)
                .then(
                    function (response) {
                        vm.success = "Changes Saved";
                        console.log(response);
                        window.history.back();
                    },
                    function (error) {
                        vm.alert = error.data;
                    }
                )
        }
        
        function deleteReview() {
            ReviewService
                .deleteReview(vm.reviewId)
                .then(
                    function (response) {
                        console.log(response);
                        window.history.back();
                    },
                    function (error) {
                        vm.alert = error;
                    }
                );
        }
    }
})();