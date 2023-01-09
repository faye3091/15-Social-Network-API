const { Thought, User } = require('../models');
const { getAllUsers } = require('./userController');

const thoughtsController = {

    //get all available Thoughts
    getAllThoughts(req,res) {
        Thought.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        //sort({_id: -1})
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
    },

    //get a certain thought by ID
    getThoughtById({params}, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with thi particular ID!'});
                return;
            }
            res.json(dbThoughtsData) 
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error)
        })
    },

    //Create a new thought
    createThought({params, body}, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return getAllUsers.findOneAndUpdate({ _id: params.userId }, { $push: { thoughts: _id }}, { new: true, runValidators: true });
        })
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts with this particular ID!'});
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch(error => res.json(error));
    },

    //Update a current thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .poulate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts with particular ID!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(error => res.status(400).json(error));
    },

    //Delete a current thought by ID
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts with this particular ID!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(error => res.status(400).json(error));
    },

    //Add a new Reaction
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body }}, { new: true, runValidators: true })
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404),json({ message: 'No thoughts with this particular ID!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(error => res.status(400).json(error))
    },

    //Delete a reaction by ID
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId }}}, { new : true })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts with this particular ID!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(error => res.status(400).json(error));
    }
}

module.exports = thoughtsController;