const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  quantity: Number,
  // Other attributes

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
