(function () {
    angular
        .module("RestaurantApp")
        .controller("ProfileController", ProfileController);
    var restaurants = [{
        restaurantsname: "foodhouse1",
        discription: "place3Our luxury Franz Josef restaurant offers not only keenly price lunch menu but also a ... See t"
    },
        {
            restaurantsname: "foodhouse2",
            discription: "good place3Our luxury Franz Josef restaurant offers not only keenly price lunch menu but also a ... See the detailed description on Franz Josef restaurant or the Café-bar for ..."
        },
        {
            restaurantsname: "foodhouse2",
            discription: "good place3 Our luxury Franz Josef restaurant offers not only keenly price lunch menu but also a ... See the detailed description on Franz Josef restaurant or the Café-bar for ..."
        }];


    function ProfileController($routeParams, UserService, $location, $rootScope, FavoriteService) {
        var vm = this;
        vm.logout = logout;

        vm.profileId = $routeParams['id'];
        vm.currentUser = false;

        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.addList = addList;
        vm.deleteList = deleteList;
        vm.searchRestaurant = searchRestaurant;
        function searchRestaurant(keyword) {
            if (!keyword) {
            } else {
                $location.url("/search/" + keyword);
            }
        }



        function init() {
            UserService
                .checkLoggedin()
                .then(
                    function (response) {
                        if (!(response.data === "0")) {
                            vm.user = response.data;
                            console.log(vm.user);
                            if (vm.user._id === vm.profileId) {
                                vm.currentUser = true;
                            } 
                        }
                    }
                );

            UserService
                .findUserById(vm.profileId)
                .then(
                    function (response) {
                        vm.profileUser = response.data;
                    }
                );

            FavoriteService
                .findAllListsForUser(vm.profileId)
                .then(function (response) {
                    vm.lists = response.data;
                })
        }

        init();

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    },
                    function (error) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }

        function unregister() {
            UserService
                .deleteUser(vm.user._id)
                .then(
                    function (response) {
                        $location.url("/login");
                    },
                    function (error) {
                        vm.error = error.data;
                    }
                );
        }

        function updateUser() {
            console.log(vm.user);
            UserService
                .updateUser(vm.user._id, vm.user)
                .then(
                    function (response) {
                        vm.success = "User successfully updated";
                    },
                    function (error) {
                        vm.error = error.data;
                    }
                )

        }

        function addList() {
            if (vm.listname) {
                if (!vm.listname) {
                    vm.error = "Please enter a name";
                }
                else {
                    vm.error = null;
                    var newlist = {
                        name: vm.listname,
                        _users: [],
                        description: "2"
                    };
                    newlist._users.push(vm.user._id);


                    FavoriteService
                        .createList(newlist)
                        .then(
                            function (response) {
                                FavoriteService
                                    .findAllListsForUser(vm.user._id)
                                    .then(function (response) {
                                        vm.lists = response.data;
                                    })
                            },
                            function (error) {
                                vm.error = error.data;
                            }
                        );
                }
            }
            else {
                vm.error = "Please enter a name";
            }

        }

        function deleteList(listId) {
            FavoriteService
                .deleteListForUser(vm.user._id, listId)
                .then(
                    function (response) {
                        FavoriteService
                            .findAllListsForUser(vm.user._id)
                            .then(function (response) {
                                vm.lists = response.data;
                            })
                    },
                    function (error) {
                        vm.error = error.data;
                    }
                )
        }
    }
})();