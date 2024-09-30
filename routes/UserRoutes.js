const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.loginUser);
router.get("/myObject", check.auth, UserController.profile);
router.post("/getUserByUserInfo", UserController.getUserByUserInfo);
router.put("/updatePassword", UserController.updatePassword);

module.exports = router;