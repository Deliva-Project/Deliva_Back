const { Schema, model } = require("mongoose");

const StoreSchema = Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    mainSede: {
        type: Boolean
    },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/dfocnzgji/image/upload/v1726658177/store_jp6mw3.png"
    },
    logo: {
        type: String,
        default: "https://res.cloudinary.com/dfocnzgji/image/upload/v1730304051/logoEmpresa_hs1ka3.jpg"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

module.exports = model("Store", StoreSchema, "stores");