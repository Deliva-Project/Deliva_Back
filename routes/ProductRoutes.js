const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const check = require("../authorization/auth");

router.post("/", check.auth, ProductController.create);
router.get("/myProducts", check.auth, ProductController.getMyProducts);

module.exports = router;