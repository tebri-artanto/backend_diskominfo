const express = require("express");
const router = new express.Router();
const DKKController = require("../controllers/DKKController");
const auth = require("../middleware/requireAuth");

router.use(auth);
router.post("/upload", DKKController.upload ,DKKController.uploadFile);
router.get("/getAll", DKKController.getAllDKK);
router.put("/update/:id", DKKController.updateDKK);
router.delete("/delete/:id", DKKController.deleteDKK);

module.exports = router;