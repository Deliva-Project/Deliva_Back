const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    name: {
        type: String
    },
    stock: {
        type: Number
    },
    price: {
        type: Number
    },
    typePrice: {
        type: String
    },
    photo: {
        type: String
    },
    expirationDate: {
        type: Date
    },
    category: {
        type: String
    },
    store: {
        type: Schema.ObjectId,
        ref: "Store"
    }
});

module.exports = model("Product", ProductSchema, "products");