const express = require("express");
const router = new express.Router();
const RKAController = require("../controllers/RKAController");
const auth = require("../middleware/requireAuth");

router.use(auth);
router.post("/upload", RKAController.upload ,RKAController.uploadFile);
router.get("/getAll", RKAController.getAllRKA);
router.get("/:id", RKAController.getRKA);
router.put("/update/:id", RKAController.updateRKA);
router.delete("/:id", RKAController.deleteRKA);

module.exports = router;