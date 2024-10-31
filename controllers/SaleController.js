const Sale = require("../models/SaleModel");
const Client = require("../models/ClientModel");
const Store = require("../models/StoreModel");

const create = async (req, res) => {
    let saleBody = req.body;
    let userId = req.user.id;
    let clientId;

    if (!saleBody.storeId || !saleBody.detail || !saleBody.paymentMethod || !saleBody.sendMethod) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    try {
        const client = await Client.findOne({ user: userId });
      
        if (!client) {
          return res.status(404).json({
            "status": "error",
            "message": "No client available..."
          });
        }
      
        clientId = client._id;
      
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding client"
        });
    }

    let saleData = {
        store: saleBody.storeId,
        detail: saleBody.detail,
        client: clientId,
        paymentMethod: saleBody.paymentMethod,
        sendMethod: saleBody.sendMethod,
        address: saleBody.address
    }

    let sale_to_save = new Sale(saleData);

    try {
        const saleStored = await sale_to_save.save();

        if (!saleStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No sale saved"
            });
        }

        return res.status(200).json({
            "sale": saleStored
        });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving sale"
        });
    }
}

const myObjectsClient = async (req, res) => {
    let userId = req.user.id;
    let clientId;

    try {
        const client = await Client.findOne({ user: userId });
      
        if (!client) {
          return res.status(404).json({
            "status": "error",
            "message": "No client available..."
          });
        }
      
        clientId = client._id;
      
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding client"
        });
    }

    Sale.find({ client: clientId }).then(sales => {
        if (sales.length == 0) {
            return res.status(404).json({
                "status": "error",
                "message": "No existen compras"
            });
        }

        return res.status(200).json({
            sales
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding sales"
        });
    });
}

const myObjectsStore = async (req, res) => {
    let userId = req.user.id;
    let storeId;

    try {
        const store = await Store.findOne({ user: userId });
      
        if (!store) {
          return res.status(404).json({
            "status": "error",
            "message": "No store available..."
          });
        }
      
        storeId = store._id;
      
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding store"
        });
    }

    Sale.find({ store: storeId }).populate(['store', { path: 'client', populate: 'user' }, { path: 'detail', populate: 'product' } ]).then(sales => {
        if (sales.length == 0) {
            return res.status(404).json({
                "status": "error",
                "message": "No existen ventas realizadas"
            });
        }

        return res.status(200).json({
            sales
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding sales"
        });
    });
}

const updateSaleStatus = async (req, res) => {
    let orderBody = req.body;

    Sale.findOneAndUpdate({ _id: orderBody._id }, { status: orderBody.status }, { new: true }).then(saleUpdated => {
        if (!saleUpdated) {
            return res.status(404).json({
                "status": "error",
                "mensaje": "Sale not found"
            });
        }
        return res.status(200).send({
            "message": "success",
            "sale": saleUpdated
        });
    }).catch((e) => {
        console.log(e);
        
        return res.status(404).json({
            "status": "error",
            "mensaje": "Error while finding and updating sale"
        });
    });
}

module.exports = {
    create,
    myObjectsClient,
    myObjectsStore,
    updateSaleStatus
}