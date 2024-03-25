const mongoose = require('mongoose');

const DKKSchema = new mongoose.Schema({
    namaKegiatan: {
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

const DKK = mongoose.model("DKK", DKKSchema);


module.exports = DKK;
