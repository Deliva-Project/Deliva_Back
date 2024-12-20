const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");

const check = require("../authorization/auth");

router.post("/", check.auth, ClientController.create);
router.get("/myObject", check.auth, ClientController.myObject);
router.put("/", check.auth, ClientController.updateInfo);

module.exports = router;