const Client = require("../models/ClientModel");

const create = async (req, res) => {
    let clientBody = req.body;
    let userId = req.user.id;

    if (!clientBody.addresses || !clientBody.phoneNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let clientData = {
        addresses: clientBody.addresses,
        phoneNumber: clientBody.phoneNumber,
        user: userId
    }

    try {
        const clients = await Client.find({ phoneNumber: clientBody.phoneNumber });

        if (clients.length >= 1) {
            return res.status(400).json({
                "status": "error",
                "message": "Ya existe un usuario con ese número de teléfono"
            });
        }

        let client_to_save = new Client(clientData);

        try {
            const clientStored = await client_to_save.save();

            if (!clientStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No client saved"
                });
            }

            return res.status(200).json({
                "client": clientStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving client"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding client duplicate"
        });
    }
}

const myObject = async (req, res) => {
    let userId = req.user.id;

    Client.findOne({ user: userId }).then(client => {
        if (!client) {
            return res.status(404).json({
                "status": "error",
                "message": "Client doesn't exist"
            });
        }

        return res.status(200).json({
            client
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding client"
        });
    });
}

module.exports = {
    create,
    myObject
}