const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/StoreController");

const check = require("../authorization/auth");

router.post("/", StoreController.create);
router.get("/myObject", check.auth, StoreController.myObject);
router.get("/list", StoreController.list);

module.exports = router;