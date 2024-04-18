const express = require("express");
const router = new express.Router();
const KegSekController = require("../controllers/KegSekController");
const auth = require("../middleware/requireAuth");

router.use(auth);
router.post("/upload", KegSekController.upload ,KegSekController.addData);
router.get("/getAll", KegSekController.getAllKegSek);
router.get("/:id", KegSekController.getKegSek);
router.put("/update/:id", KegSekController.updateKegSek);
router.delete("/delete/:id", KegSekController.deleteKegSek);

module.exports = router;