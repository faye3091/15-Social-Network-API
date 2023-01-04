const { Schema, model } = require('mongoose');
const moment = require('moment');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {

    },
    reactions: {
        
    }
})