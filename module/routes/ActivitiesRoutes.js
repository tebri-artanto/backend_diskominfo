const express = require("express");
const router = new express.Router();
const activitiesController = require("../controllers/ActivitiesController");
const auth = require("../middleware/requireAuth");

// router.use(auth);
router.post("/upload", activitiesController.upload ,activitiesController.uploadImage);
router.get("/getAll", activitiesController.getAllActivities);
router.get("/:id", activitiesController.getActivity);
router.put("/:id", activitiesController.updateActivity);
router.delete("/:id", activitiesController.deleteActivity);

module.exports = router;