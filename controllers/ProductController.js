const Product = require("../models/ProductModel");
const Store = require("../models/StoreModel");

const cloudinary = require('cloudinary');
const fs = require('fs');

const create = async (req, res) => {
    let productBody = req.body;
    let userId = req.user.id;
    let storeId;

    if (!productBody.name || !productBody.stock || !productBody.price || !productBody.typePrice || !productBody.expirationDate) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    try {
        const store = await Store.findOne({ user: userId });
      
        if (!store) {
          return res.status(404).json({
            "message": "No store available..."
          });
        }
      
        storeId = store._id;
      
    } catch (error) {
        return res.status(500).json({
            "message": "Error while finding store"
        });
    }

    let productData = {
        name: productBody.name,
        stock: productBody.stock,
        price: productBody.price,
        typePrice: productBody.typePrice,
        expirationDate: productBody.expirationDate,
        store: storeId
    }

    let product_to_save = new Product(productData);

    try {
        const productStored = await product_to_save.save();

        if (!productStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No product saved"
            });
        }

        return res.status(200).json({
            "product": productStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving product"
        });
    }
}

const getMyProducts = async (req, res) => {
    let userId = req.user.id;
    let storeId;

    try {
        const store = await Store.findOne({ user: userId });
      
        if (!store) {
          return res.status(404).json({
            "status": "error",
            "message": "No store available..."
          });
        }
      
        storeId = store._id;
      
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding store"
        });
    }

    let page = req.query.page;
    let skipvalue = page == 1 ? 0 : (page - 1) * 5;

    Product.find({ store: storeId, deleted: false }).limit(5).skip(skipvalue).then(products => {
        if (products.length == 0) {
            return res.status(404).json({
                "status": "error",
                "message": "No existen productos"
            });
        }

        return res.status(200).json({
            products
        });
    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding products"
        });
    });
}

const update = async (req, res) => {
    let productId = req.query.productId;
    let productBody = req.body;

    if (!productBody.name || !productBody.stock || !productBody.price || !productBody.typePrice || !productBody.expirationDate) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    Product.findOneAndUpdate({ _id: productId }, productBody, { new: true }).then(productUpdated => {
        if (!productUpdated) {
            return res.status(404).json({
                "status": "error",
                "mensaje": "Product not found"
            });
        }
        return res.status(200).send({
            "message": "success",
            "product": productUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "mensaje": "Error while finding and updating product"
        });
    });
}

const deleteFlag = async (req, res) => {
    let productId = req.query.productId;

    Product.findOneAndUpdate({ _id: productId }, { deleted: true }, { new: true }).then(productUpdated => {
        if (!productUpdated) {
            return res.status(404).json({
                "status": "error",
                "mensaje": "Product not found"
            });
        }
        return res.status(200).send({
            "message": "success"
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "mensaje": "Error while finding and deleting product"
        });
    });
}

const updateImage = async (req, res) => {
    try {
        const response = await cloudinary.v2.uploader.upload(req.file.path, { public_id: req.body.id });

        fs.unlinkSync(req.file.path);

        Product.findOneAndUpdate({ _id: req.body.id }, { photo: response.url }, { new: true }).then(buildingUpdated => {
            if (!buildingUpdated) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Building not found"
                });
            }

            return res.status(200).send({
                status: "success",
                building: buildingUpdated
            });
        }).catch(() => {
            return res.status(404).json({
                status: "error",
                mensaje: "Error while finding and updating building"
            });
        });
    } catch (error) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({
            status: "error",
            error
        });
    }
}

module.exports = {
    create,
    getMyProducts,
    update,
    deleteFlag,
    updateImage
}