const { User } = require('../models');

const userController = {

    //Get all users
    getAllUsers(req, res) {
        User.find({})
        // populate users thoughts
        .populate({path: 'thoughts', select: '-__v'})
        // populate user friends
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .sort({_id: -1})
        .then(dbUsersData => res.json(dbUsersData))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
    },

    //Get single user by ID
    getUserById({ params}, res) {
        User.findOne({_id: params.id })
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        // return if no user is found 
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({ message: 'No User with this particular ID!'});
                return; 
            }
            res.json(dbUsersData)
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error)
        })
    },

    //Create a new User
    createUser({ body }, res) {
        User.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(error => res.status(400).json(error));
    },

    //Update a current User by ID
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id} , body, { new: true, runValidators: true })
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({ message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.status(400).json(error))
    },

    //Delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({ message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(error => res.status(400).json(error));
    },

    //Add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.id }, { $push: { friends: params.friendId }}, { new: true, runValidators: true })
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'No User with this particular ID!'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(error => res.json(error));
    },

    //Delete a current Friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.id }, { pull: { friends: params.friendId }}, { new: true })
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No User with this particular ID!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => res.status(400).json(error));
    }
}

module.exports = userController;