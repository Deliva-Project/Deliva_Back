const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

console.log("Deliva backend api started");

connection(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

let cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UserRoutes = require("./routes/UserRoutes");
app.use("/api/users", UserRoutes);
const StoreRoutes = require("./routes/StoreRoutes");
app.use("/api/stores", StoreRoutes);
const ProductRoutes = require("./routes/ProductRoutes");
app.use("/api/products", ProductRoutes);
const ClientRoutes = require("./routes/ClientRoutes");
app.use("/api/clients", ClientRoutes);
const ShoppingCartRoutes = require("./routes/ShoppingCartRoutes");
app.use("/api/shopping-carts", ShoppingCartRoutes);
const SaleRoutes = require("./routes/SaleRoutes");
app.use("/api/sales", SaleRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "1.5.0"
    });
});

const server = http.createServer(app);
const io = socketIo(server);

const requests = require('./socket-requests/requests');
requests(io);

server.listen(port, () => {
    console.log("Node server running in port:", port); 
});