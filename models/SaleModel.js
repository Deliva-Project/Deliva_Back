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
    rider: {
        type: Schema.ObjectId,
        ref: "Rider"
    },
    client: {
        type: Schema.ObjectId,
        ref: "Client"
    },
    paymentMethod: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String
    }
});

module.exports = model("Sale", SaleSchema, "sales");