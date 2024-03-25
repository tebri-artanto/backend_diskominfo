const express = require("express");
const router = new express.Router();
const DataAsetController = require("../controllers/DataAsetController");
const auth = require("../middleware/requireAuth");

// router.use(auth);
router.post("/upload", DataAsetController.upload ,DataAsetController.uploadFile);
router.get("/getAll", DataAsetController.getAllDataAset);
router.put("/update/:id", DataAsetController.updateDataAset);
router.delete("/delete/:id", DataAsetController.deleteDataAset);

module.exports = router;