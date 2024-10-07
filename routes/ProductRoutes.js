const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const check = require("../authorization/auth");

router.post("/", check.auth, ProductController.create);
router.get("/myProducts", check.auth, ProductController.getMyProducts);
router.put("/", check.auth, ProductController.update);

module.exports = router;