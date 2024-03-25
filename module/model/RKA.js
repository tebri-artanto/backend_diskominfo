const mongoose = require('mongoose');

const dpaSchema = new mongoose.Schema({
    judul: {
        type: String,
        // required: true,
    },
    deskripsi: {
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

const Rka = mongoose.model("RKA", dpaSchema);

module.exports = Rka;
