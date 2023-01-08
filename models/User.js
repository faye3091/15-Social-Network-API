const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // use REGEX to validate email
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }], 
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

//get total count of friends
UserSchema.virtual('friendsCount').get(function() {
    return this.friends.length;
})

//create the User model using the User Schema
const User = model('User', UserSchema);

module.exports = User;