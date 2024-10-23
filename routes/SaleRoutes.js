const express = require("express");
const router = express.Router();
const SaleController = require("../controllers/SaleController");

const check = require("../authorization/auth");

router.post("/", check.auth, SaleController.create);
/*router.get("/myObject", check.auth, StoreController.myObject);
router.get("/list", StoreController.list);*/

module.exports = router;