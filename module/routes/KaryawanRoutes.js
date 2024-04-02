const express = require("express");
const router = new express.Router();
const karyawanController = require("../controllers/KaryawanController");

router.post("/add", karyawanController.addKaryawan);
router.get("/getAll", karyawanController.getAllKaryawan);
router.delete("/delete/:id", karyawanController.deleteKaryawan);

module.exports = router;