const mongoose = require('mongoose');

const KegSekSchema = new mongoose.Schema({
    namaKegiatan: {
        type: String,
        // required: true,
    },
    deskripsi: {
        type: String,
        // required: true,
    },
    tanggal: {
        type: Date,
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

const KegSek = mongoose.model("KegSek", KegSekSchema);


module.exports = KegSek;
