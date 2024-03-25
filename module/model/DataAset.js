const mongoose = require('mongoose');

const DataAsetSchema = new mongoose.Schema({
    namaAset: {
        type: String,
        // required: true,
    },
    kategori: {
        type: String,
        // required: true,
    },
    deskripsi: {
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

const DataAset = mongoose.model("DataAset", DataAsetSchema);


module.exports = DataAset;
