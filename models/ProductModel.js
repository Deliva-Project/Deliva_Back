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
        default: "https://res.cloudinary.com/dfocnzgji/image/upload/v1727715381/producto_ztmqss.avif"
    },
    expirationDate: {
        type: Date
    },
    /*category: {
        type: String
    },*/
    store: {
        type: Schema.ObjectId,
        ref: "Store"
    }
});

module.exports = model("Product", ProductSchema, "products");