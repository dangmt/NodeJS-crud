const express = require("express");
const paypal = require("paypal-rest-sdk");
const CartItem = require("../Schema/cartitem"); // Import your CartItem model

const router = express.Router();

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID, // Replace with your PayPal client ID
  client_secret: process.env.PAYPAL_CLIENT_SECRET, // Replace with your PayPal client secret
});

// Implement the logic for completing the PayPal payment
router.get("/paypal/complete", (req, res) => {
  // Implement your logic for handling the payment completion
  // For example, render a success page or process the payment confirmation
  res.render("complete"); // Render a view/template named 'complete'
});

// Implement the logic for handling a canceled PayPal payment
router.get("/paypal/cancel", (req, res) => {
  // Implement your logic for handling a canceled payment
  // For example, render a cancellation page or notify the user
  res.render("cancel"); // Render a view/template named 'cancel'
});

// Create a PayPal payment
router.get("/paypal", async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate("product");

    const orderAmount = calculateOrderTotal(cartItems);

    const createPaymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/paypal/complete",
        cancel_url: "http://localhost:3000/paypal/cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((cartItem) => ({
              name: cartItem.product.name,
              currency: "USD",
              quantity: cartItem.quantity,
              price: cartItem.product.price.toFixed(2),
            })),
          },
          amount: {
            currency: "USD",
            total: orderAmount.toFixed(2),
          },
          description: "Purchase from Your Store",
        },
      ],
    };

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        console.error("PayPal API error:", error);
        return res.status(400).send("PayPal API error");
      }
      res.status(200).json({ approvalUrl: payment.links[1].href });
    });
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
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
