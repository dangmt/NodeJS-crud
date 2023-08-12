const express = require("express");
const CartItem = require("../Schema/cartitem"); // Import your CartItem model
const Product = require("../Schema/product"); // Import your Product model

const router = express.Router();

// Store a cart item
router.post("/cartitems", async (req, res) => {
  try {
    var { productId, quantity } = req.body;
    console.log(req.body);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    quantity = parseInt(quantity);
    let cartItem = await CartItem.findOne({ product: productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      res.status(200).send("Product quantity updated in cart");
    } else {
      cartItem = new CartItem({
        product: productId,
        quantity: quantity,
      });
      await cartItem.save();
      res.status(200).send("Product added to cart");
    }
  } catch (error) {
    console.error("Error storing cart item:", error);
    res.status(500).send("Internal server error");
  }
});

// Get a cart item by ID
router.get("/cartitems/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;
    console.log(req.body);

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).send("Cart item not found");
    }
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res.status(500).send("Internal server error");
  }
});

// Update a cart item
router.put("/cartitems/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).send("Cart item not found");
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).send("Internal server error");
  }
});

// Delete a cart item
router.delete("/cartitems/:cartItemId", async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).send("Cart item not found");
    }

    await cartItem.deleteOne();
    res.status(200).send("Cart item deleted successfully");
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).send("Internal server error");
  }
});

// Get all cart items
router.get("/cartitems", async (req, res) => {
  console.log(req.body);

  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
