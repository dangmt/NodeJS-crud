const express = require("express");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");

const bodyParser = require("body-parser");
const Product = require("./Schema/product"); // Import your Product model
const Order = require("./Schema/order");
const OrderItem = require("./Schema/orderitem");

const CartItem = require("./Schema/cartitem");
const productController = require("./Controller/product");
const cartItemController = require("./Controller/cartitem");
const orderController = require("./Controller/order");
const stripeController = require("./Controller/stripe");

const paypalController = require("./Controller/paypal");

require("./db"); // Import and run your MongoDB connection setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Your routes and application logic go here
app.use("/", cartItemController);
app.use("/", productController);
app.use("/", orderController);
app.use("/", stripeController);
app.use("/", paypalController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
