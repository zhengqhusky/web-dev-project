module.exports = function () {

    var UserSchema = require("./user.schema.server")();
    var mongoose = require("mongoose");
    var User = mongoose.model("ProjectUser", UserSchema);

    var api = {
        createUser: createUser,
        deleteUser: deleteUser,
        updateUser: updateUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserById: findUserById,
        findUserByEmail: findUserByEmail,
        findFriendsByUserId:findFriendsByUserId,
        AddFriendById: AddFriendById,
        deleteFriend: deleteFriend,
        getFriends: getFriends
    };
    return api;

    function createUser(user) {
        return User.create(user);
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function updateUser(userId, user) {
        console.log(user);
        return User.update(
            {_id: userId},
            {
                $set: {
                    firstName: user.firstName,
                    email: user.email
                }
            }
        );
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return User.findOne({_id: userId});
    }
    function findUserByEmail(email) {
        return User.findOne({email: email});
    }
    function findFriendsByUserId(userId){
        return User.find({_user: userId});
    }

    function AddFriendById(userId, fid) {
        return User.update(
            {_id: userId},
            {
                $push: {
                    friends: fid
                }
            }
        );
    }
    function deleteFriend(userId,friendId) {
        return User.update(
            {_id: userId},
            {
                $pull: {
                    friends: friendId
                }
            }
        );
    }

    function getFriends(friendlist) {
        var friends = [];

        return User.find({
            _id: {$in: friendlist}
        });
    }



};