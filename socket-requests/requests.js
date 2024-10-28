const storeSockets = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
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
    });
}