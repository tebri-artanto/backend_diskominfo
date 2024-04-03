const express = require("express");
const router = new express.Router();
const authController = require("../controllers/AuthController");

router.post("/register", authController.signUp);
router.get("/users", authController.showAllUsers);
router.post("/login", authController.logIn);
router.get("/user/:userId/activities", authController.getUserActivities);
router.get("/:userId", authController.getUserById);
// router.post("/login", authController.logIn);

module.exports = router;