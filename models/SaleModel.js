const { Schema, model } = require("mongoose");

const SaleSchema = Schema({
    store: {
        type: Schema.ObjectId,
        ref: "Store"
    },
    detail: [
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
    client: {
        type: Schema.ObjectId,
        ref: "Client"
    },
    paymentMethod: {
        type: String
    },
    sendMethod: {
        type: String
    },
    address: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Aceptado"
    }
});

module.exports = model("Sale", SaleSchema, "sales");