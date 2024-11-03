const ShoppingCart = require("../models/ShoppingCartModel");

const create = async (req, res) => {
    let shopppingCartBody = req.body;

    if (!shopppingCartBody.products || !shopppingCartBody.userId) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let shoppingCartData = {
        products: shopppingCartBody.products,
        user: shopppingCartBody.userId
    }

    try {
        const shopppingCarts = await ShoppingCart.find({ user: shoppingCartData.user });

        if (shopppingCarts.length >= 1) {
            return res.status(400).json({
                "status": "error",
                "message": "Ya existe un carrito de compras asociado a esta cuenta"
            });
        }

        let shoppping_cart_to_save = new ShoppingCart(shoppingCartData);

        try {
            const shopppingCartStored = await shoppping_cart_to_save.save();

            if (!shopppingCartStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No shoppping cart saved"
                });
            }

            return res.status(200).json({
                "shopppingCart": shopppingCartStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving shopping cart"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding shopping cart duplicate"
        });
    }
}

const myObject = async (req, res) => {
    let userId = req.user.id;

    ShoppingCart.findOne({ user: userId }).populate({ path: 'products', populate: { path: 'product', populate: 'store' }}).then(shoppingCart => {
        if (!shoppingCart) {
            return res.status(404).json({
                "status": "error",
                "message": "Shopping Cart doesn't exist"
            });
        }

        return res.status(200).json({
            shoppingCart
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding shopping cart"
        });
    });
}

const updateProducts = async (req, res) => {
    let shoppingCartBody = req.body;
    let userId = req.user.id;

    ShoppingCart.findOneAndUpdate({ user: userId }, { products: shoppingCartBody.products }, { new: true }).then(shopppingCartUpdated => {
        if (!shopppingCartUpdated) {
            return res.status(404).json({
                "status": "error",
                "mensaje": "Shopping Cart not found"
            });
        }
        return res.status(200).send({
            "message": "success",
            "shoppingCart": shopppingCartUpdated
        });
    }).catch((e) => {
        return res.status(404).json({
            "status": "error",
            "mensaje": "Error while finding and updating shopping cart"
        });
    });
}

module.exports = {
    create,
    myObject,
    updateProducts
}