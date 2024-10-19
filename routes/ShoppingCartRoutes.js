const express = require("express");
const router = express.Router();
const ShoppingCartController = require("../controllers/ShoppingCartController");

const check = require("../authorization/auth");

router.post("/", ShoppingCartController.create);
router.get("/myObject", check.auth, ShoppingCartController.myObject);
router.put("/", check.auth, ShoppingCartController.updateProducts);

module.exports = router;