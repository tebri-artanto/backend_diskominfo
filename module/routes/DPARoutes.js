const express = require("express");
const router = new express.Router();
const DPAController = require("../controllers/DPAController");
const auth = require("../middleware/requireAuth");

// router.use(auth);
router.post("/upload", DPAController.upload ,DPAController.uploadFile);
router.get("/getAll", DPAController.getAllDPA);
router.get("/:id", DPAController.getDPA);
router.put("/update/:id", DPAController.updateDPA);
router.delete("/delete/:id", DPAController.deleteDPA);

module.exports = router;