const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  quantity: Number,
  // Other attributes

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
