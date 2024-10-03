const Product = require("../models/ProductModel");
const Store = require("../models/StoreModel");

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
            "message": "No store available..."
          });
        }
      
        storeId = store._id;
      
    } catch (error) {
        return res.status(500).json({
            "message": "Error while finding store"
        });
    }

    Product.find({ store: storeId }).then(products => {
        if (!products) {
            return res.status(404).json({
                "message": "No products avaliable..."
            });
        }

        return res.status(200).json({
            products
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding products"
        });
    });
}

module.exports = {
    create,
    getMyProducts
}