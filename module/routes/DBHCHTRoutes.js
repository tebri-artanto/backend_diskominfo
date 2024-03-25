const express = require("express");
const router = new express.Router();
const DBHCHTController = require("../controllers/DBHCHTController");
const auth = require("../middleware/requireAuth");

// router.use(auth);
router.post("/upload", DBHCHTController.upload ,DBHCHTController.uploadFile);
router.get("/getAll", DBHCHTController.getAllDBHCHT);
router.put("/update/:id", DBHCHTController.updateDBHCHT);
router.delete("/delete/:id", DBHCHTController.deleteDBHCHT);

module.exports = router;