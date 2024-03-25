const mongoose = require('mongoose');
const Activities = require('./activities'); // Import the activities model

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    activities: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Activities' } // Referencing the activities model
    ] // Embedding activities as an array of activitiesSchema documents
});

const User = model('User', userSchema);

module.exports = User;
