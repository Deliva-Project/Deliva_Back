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
router.get("/myProducts", check.auth, ProductController.getMyProducts);
router.put("/", ProductController.update);
router.delete("/", ProductController.deleteFlag);
router.put("/image", upload.single('file'), ProductController.updateImage);

module.exports = router;