const { Schema, model } = require("mongoose");

const RiderSchema = Schema({
    motorcyclePlate: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

module.exports = model("Rider", RiderSchema, "riders");