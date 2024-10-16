const express = require("express");
const multer = require("multer");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const check = require("../authorization/auth");
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "./")
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/", check.auth, ProductController.create);
router.get("/getMyProducts", check.auth, ProductController.getMyProducts);
router.get("/getProducts", ProductController.getProducts);
router.get("/getProductsByStore", ProductController.getProductsByStore);
router.put("/", ProductController.update);
router.delete("/", ProductController.deleteFlag);
router.put("/image", upload.single('file'), ProductController.updateImage);
router.get("/mySearch", check.auth, ProductController.searchMyProducts);
router.get("/search", ProductController.searchProducts);
router.get("/searchByStore", ProductController.searchProductsByStore);

module.exports = router;