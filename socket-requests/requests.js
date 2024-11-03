const storeSockets = {};
const clientSockets = {};
const saleSockets = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        //Client buys products
        socket.on('registerStore', (storeId) => {
            storeSockets[storeId] = socket;
        });

        socket.on('newBuy', (storeId) => {
            const storeSocket = storeSockets[storeId];
            if (storeSocket) {
              storeSocket.emit('notificationNewBuy');
            }
        });

        socket.on('unregisterStore', (storeId) => {
            delete storeSockets[storeId];
        });

        //Store updates status from sale in all sales view
        socket.on('registerClient', (userId) => {
            clientSockets[userId] = socket;
        });

        socket.on('unregisterClient', (userId) => {
            delete clientSockets[userId];
        });

        //Store updates status from sale in saleview
        socket.on('registerSale', (saleId) => {
            saleSockets[saleId] = socket;
        });

        socket.on('changeOrderStatus', (arg) => {
            const saleSocket = saleSockets[arg.saleId];
            if (saleSocket) {
                saleSocket.emit('notificationChangeOrderStatusSale', arg.newStatus);
            }

            const clientSocket = clientSockets[arg.userId];
            if (clientSocket) {
                clientSocket.emit('notificationChangeOrderStatusClient');
            }
        });

        socket.on('unregisterSale', (saleId) => {
            delete saleSockets[saleId];
        });
    });
}