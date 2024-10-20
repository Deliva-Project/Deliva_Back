const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.loginUser);
router.get("/myObject", check.auth, UserController.profile);
router.post("/sendVerificationCode", UserController.sendVerificationCode);
router.post("/verifyCode", UserController.verifyCode);
router.put("/updatePassword", UserController.updatePassword);
router.put("/updateEmail", check.auth, UserController.updateEmail);

module.exports = router;