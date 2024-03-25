const mongoose = require('mongoose');

const karyawanSchema = new mongoose.Schema({
    nama: {
        type: String,
        // required: true,
    },
    nip: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const karyawan = mongoose.model("karyawan", karyawanSchema);


module.exports = karyawan;
