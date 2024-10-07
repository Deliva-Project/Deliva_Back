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
        type: String,
        default: "https://res.cloudinary.com/dfocnzgji/image/upload/v1727953299/producto_ajpltw.png"
    },
    expirationDate: {
        type: Date
    },
    /*category: {
        type: String
    },*/
    deleted: {
        type: Boolean,
        default: false
    },
    store: {
        type: Schema.ObjectId,
        ref: "Store"
    }
});

module.exports = model("Product", ProductSchema, "products");