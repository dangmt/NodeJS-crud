const express = require("express");
const Order = require("../Schema/order"); // Import your Order model
const CartItem = require("../Schema/cartitem"); // Import your CartItem model
const OrderItem = require("../Schema/orderitem"); // Import your OrderItem model
const router = express.Router();

// Create an order
router.post("/orders", async (req, res) => {
  try {
    const order = new Order();
    await order.save();

    const cartItems = await CartItem.find().populate("productId");
    for (const cartItem of cartItems) {
      const orderItem = new OrderItem({
        orderId: order._id,
        productId: cartItem.productId._id,
        quantity: cartItem.quantity,
      });
      await orderItem.save();
      order.orderItems.push(orderItem);
      await order.save();
    }

    res.status(200).send("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Internal server error");
  }
});

// Get an order by ID
router.get("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("orderItems");
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send("Internal server error");
  }
});

// Update an order
router.put("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).send("Order not found");
    }

    // Update order properties if needed
    // Example: existingOrder.status = req.body.status;
    // await existingOrder.save();

    res.status(200).send("Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Internal server error");
  }
});

// Delete an order
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    await OrderItem.deleteMany({ orderId: orderId });
    await order.deleteOne();
    res.status(200).send("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Internal server error");
  }
});

// Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("orderItems");
    console.log((await OrderItem.find()).toString());
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal server error");
  }
});
router.delete("/orders", async (req, res) => {
  try {
    const orders = await Order.deleteMany();
    res.status(200).json("success");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
