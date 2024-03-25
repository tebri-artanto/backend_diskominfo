const mongoose = require('mongoose');

const DBHCHTSchema = new mongoose.Schema({
    judul: {
        type: String,
        // required: true,
    },
    kategori: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    fileUrl: {
        type: String,
        required: true,
    },

});

const DBHCHT = mongoose.model("DBHCHT", DBHCHTSchema);

module.exports = DBHCHT;
