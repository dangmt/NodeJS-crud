const express = require("express");
const Stripe = require("stripe");
const CartItem = require("../Schema/cartitem"); // Import your CartItem model
const Product = require("../Schema/product"); // Import your Product model

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

// Get payment intent
router.get("/stripe", async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate("product");

    const orderAmount = calculateOrderTotal(cartItems);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount * 100, // Amount in cents
      currency: "usd",
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Internal server error");
  }
});

// Calculate order total
function calculateOrderTotal(cartItems) {
  let orderAmount = 0;

  for (const cartItem of cartItems) {
    orderAmount += cartItem.product.price * cartItem.quantity;
  }

  return orderAmount;
}

module.exports = router;
