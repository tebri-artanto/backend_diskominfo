const mongoose = require('mongoose');

const activitiesSchema = new mongoose.Schema({
    activity: {
        type: String,
        // required: true,
    },
    date: {
        type: Date,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Activities = mongoose.model("Activities", activitiesSchema);


module.exports = Activities;
