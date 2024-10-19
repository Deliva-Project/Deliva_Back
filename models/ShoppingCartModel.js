const { Schema, model } = require("mongoose");

const ShoppingCartSchema = Schema({
    products: [
        {
            product: {
                type: Schema.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            }
        }
    ],
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

module.exports = model("ShoppingCart", ShoppingCartSchema, "shopping-carts");