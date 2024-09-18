const { Schema, model } = require("mongoose");

const ClientSchema = Schema({
    addresses: [
        {
            street: {
                type: String
            },
            number: {
                type: String
            },
            district: {
                type: String
            },
            city: {
                type: String
            }
        }
    ],
    phoneNumber: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

module.exports = model("Client", ClientSchema, "clients");