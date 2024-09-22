const Store = require("../models/StoreModel");

const create = async (req, res) => {
    let storeBody = req.body;
    let userId = req.query.userId;

    if (!storeBody.name || !storeBody.address || !storeBody.mainSede) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let storeData = {
        name: storeBody.name,
        address: storeBody.address,
        mainSede: storeBody.mainSede,
        user: userId
    }

    try {
        const stores = await Store.find({ name: storeData.name, address: storeData.address });

        if (stores.length >= 1) {
            return res.status(400).json({
                "status": "error",
                "message": "Ya existe una tienda con el mismo nombre y dirección"
            });
        }

        let store_to_save = new Store(storeData);

        try {
            const storeStored = await store_to_save.save();

            if (!storeStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No store saved"
                });
            }

            return res.status(200).json({
                "store": storeStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving store"
            });
        }
    } catch {
        return res.status(500).json({
            "message": "Error while finding store duplicate"
        });
    }
}

const myObject = async (req, res) => {
    let userId = req.user.id;

    Store.find({ user: userId }).then(store => {
        if (!store) {
            return res.status(404).json({
                "status": "error",
                "message": "Store doesn't exist"
            });
        }

        return res.status(200).json({
            store
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding store"
        });
    });
}

module.exports = {
    create,
    myObject
}